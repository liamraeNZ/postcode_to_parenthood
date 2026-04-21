var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// index.ts
function log(level, message, meta) {
  const payload = {
    level,
    message,
    ...meta
  };
  if (level === "error") {
    console.error(JSON.stringify(payload));
  } else if (level === "warn") {
    console.warn(JSON.stringify(payload));
  } else if (level === "info") {
    console.log(JSON.stringify(payload));
  } else {
    console.debug(JSON.stringify(payload));
  }
}
__name(log, "log");
function requestId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}
__name(requestId, "requestId");
function jsonResponse(body, init) {
  const headers = new Headers(init?.headers);
  headers.set("content-type", "application/json; charset=utf-8");
  headers.set("access-control-allow-origin", "*");
  headers.set("access-control-allow-methods", "GET,POST,OPTIONS");
  headers.set("access-control-allow-headers", "content-type");
  return new Response(JSON.stringify(body), {
    ...init,
    headers
  });
}
__name(jsonResponse, "jsonResponse");
function normalizePostcode(input) {
  return input.trim().toUpperCase().replace(/\s+/g, "");
}
__name(normalizePostcode, "normalizePostcode");
function isReasonablePostcodeInput(input) {
  const trimmed = input.trim();
  if (!trimmed) return false;
  if (trimmed.length > 16) return false;
  return /^[A-Za-z0-9 ]+$/.test(trimmed);
}
__name(isReasonablePostcodeInput, "isReasonablePostcodeInput");
async function fetchWithTimeout(input, init, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}
__name(fetchWithTimeout, "fetchWithTimeout");
async function resolveIcbId(db, icbCode, icbName) {
  const byCode = await db.prepare("select id from icbs where nhs_code = ?1 limit 1").bind(icbCode).first();
  if (byCode?.id) return byCode.id;
  const byAliasCode = await db.prepare(
    "select icb_id as id from icb_aliases where alias_kind = 'code' and alias = ?1 limit 1"
  ).bind(icbCode).first();
  if (byAliasCode?.id) return byAliasCode.id;
  if (!icbName) return null;
  const byAliasName = await db.prepare(
    "select icb_id as id from icb_aliases where alias_kind = 'name' and alias = ?1 limit 1"
  ).bind(icbName).first();
  return byAliasName?.id ?? null;
}
__name(resolveIcbId, "resolveIcbId");
async function lookupIcbPolicyByPostcode(db, postcode, ctx) {
  const normalized = normalizePostcode(postcode);
  if (!normalized) return null;
  const upstreamUrl = `https://api.postcodes.io/postcodes/${encodeURIComponent(normalized)}`;
  const upstreamStartedAt = Date.now();
  let postcodesIoResponse;
  try {
    postcodesIoResponse = await fetchWithTimeout(upstreamUrl, {}, 8e3);
  } catch (err) {
    log("error", "upstream fetch failed", {
      request_id: ctx.requestId,
      upstream: "api.postcodes.io",
      url: upstreamUrl,
      duration_ms: Date.now() - upstreamStartedAt,
      err: err instanceof Error ? { name: err.name, message: err.message, stack: err.stack } : err
    });
    throw err;
  }
  log("debug", "upstream response", {
    request_id: ctx.requestId,
    upstream: "api.postcodes.io",
    status: postcodesIoResponse.status,
    duration_ms: Date.now() - upstreamStartedAt
  });
  if (postcodesIoResponse.status === 404) return null;
  if (postcodesIoResponse.status === 429) {
    throw new Error("Upstream rate limited");
  }
  if (!postcodesIoResponse.ok) {
    throw new Error(`Upstream error: ${postcodesIoResponse.status}`);
  }
  let json;
  try {
    json = await postcodesIoResponse.json();
  } catch (err) {
    log("error", "upstream returned invalid JSON", {
      request_id: ctx.requestId,
      upstream: "api.postcodes.io",
      err: err instanceof Error ? { name: err.name, message: err.message, stack: err.stack } : err
    });
    throw new Error("Upstream invalid JSON");
  }
  const icbCode = json.result?.codes?.icb ?? null;
  if (!icbCode) return null;
  const icbId = await resolveIcbId(db, icbCode, null);
  if (!icbId) return null;
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const policy = await db.prepare(
    `
      select
        i.name as icb_name,
        p.cycles_offered,
        p.max_age,
        p.bmi_min,
        p.bmi_max,
        p.iui_rounds_required,
        p.wait_time_months,
        p.endometriosis_priority_access,
        p.smoking_restricted,
        p.living_children_rule,
        p.updated_at
      from icb_policies p
      join icbs i on i.id = p.icb_id
      where p.icb_id = ?1 and (p.effective_to is null or p.effective_to >= ?2)
      order by p.effective_from desc
      limit 1
    `
  ).bind(icbId, today).first();
  if (!policy) return null;
  return {
    icb_name: policy.icb_name,
    cycles_offered: policy.cycles_offered,
    max_age: policy.max_age,
    bmi_min: policy.bmi_min,
    bmi_max: policy.bmi_max,
    iui_rounds_required: policy.iui_rounds_required,
    wait_time_months: policy.wait_time_months,
    endometriosis_priority_access: Boolean(policy.endometriosis_priority_access),
    smoking_restricted: Boolean(policy.smoking_restricted),
    living_children_rule: policy.living_children_rule,
    updated_at: policy.updated_at
  };
}
__name(lookupIcbPolicyByPostcode, "lookupIcbPolicyByPostcode");
var index_default = {
  async fetch(request, env) {
    const reqId = requestId();
    const startedAt = Date.now();
    const url = new URL(request.url);
    if (request.method === "OPTIONS") {
      return jsonResponse({ ok: true });
    }
    try {
      log("info", "request start", {
        request_id: reqId,
        method: request.method,
        path: url.pathname
      });
      if (url.pathname === "/api/icb-policy" && request.method === "GET") {
        const postcode = url.searchParams.get("postcode");
        if (!postcode) {
          return jsonResponse({ error: "Missing postcode", request_id: reqId }, { status: 400 });
        }
        if (!isReasonablePostcodeInput(postcode)) {
          return jsonResponse({ error: "Invalid postcode", request_id: reqId }, { status: 400 });
        }
        const policy = await lookupIcbPolicyByPostcode(env.DB, postcode, { requestId: reqId });
        if (!policy) {
          return jsonResponse({ error: "Not found", request_id: reqId }, { status: 404 });
        }
        return jsonResponse(policy);
      }
      return jsonResponse({ error: "Not found", request_id: reqId }, { status: 404 });
    } catch (err) {
      log("error", "request failed", {
        request_id: reqId,
        method: request.method,
        path: url.pathname,
        duration_ms: Date.now() - startedAt,
        err: err instanceof Error ? { name: err.name, message: err.message, stack: err.stack } : err
      });
      return jsonResponse({ error: "Internal server error", request_id: reqId }, { status: 500 });
    } finally {
      log("info", "request end", {
        request_id: reqId,
        method: request.method,
        path: url.pathname,
        duration_ms: Date.now() - startedAt
      });
    }
  }
};

// ../node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-mnTBau/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = index_default;

// ../node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-mnTBau/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
