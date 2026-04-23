import { jsonResponse, requestId } from './lib';
import type { Env } from './types';

/**
 * Basic Auth guard for admin endpoints.
 *
 * Returns `null` when credentials are valid (caller should proceed).
 * Returns a `Response` (401 or 500) when auth fails or env is misconfigured.
 */
export function checkBasicAuth(request: Request, env: Env): Response | null {
  // 1. Env vars must be configured
  if (!env.ADMIN_USERNAME || !env.ADMIN_PASSWORD) {
    return jsonResponse(
      { error: 'Server misconfiguration', request_id: requestId() },
      { status: 500 }
    );
  }

  // 2. Authorization header must be present
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return new Response(null, {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Admin"' },
    });
  }

  // 3. Decode and validate credentials
  const match = authHeader.match(/^Basic\s+(.+)$/i);
  if (!match) {
    return new Response(null, {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Admin"' },
    });
  }

  let decoded: string;
  try {
    decoded = atob(match[1]);
  } catch {
    return new Response(null, {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Admin"' },
    });
  }

  // Split on the first `:` only
  const colonIndex = decoded.indexOf(':');
  if (colonIndex === -1) {
    return new Response(null, {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Admin"' },
    });
  }

  const username = decoded.slice(0, colonIndex);
  const password = decoded.slice(colonIndex + 1);

  // 4. Compare against env vars
  if (username === env.ADMIN_USERNAME && password === env.ADMIN_PASSWORD) {
    return null; // pass-through
  }

  return new Response(null, {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Admin"' },
  });
}
