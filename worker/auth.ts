import { jsonResponse, requestId } from './lib';
import type { Env } from './types';

/**
 * Timing-safe string comparison using HMAC-SHA256.
 *
 * Hashes both strings with HMAC to produce equal-length byte arrays,
 * then XOR-compares them to avoid timing side-channel leaks.
 */
async function timingSafeEqual(a: string, b: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode('p2p-auth-comparison-key');
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sigA = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(a)));
  const sigB = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(b)));
  if (sigA.length !== sigB.length) return false;
  let result = 0;
  for (let i = 0; i < sigA.length; i++) result |= sigA[i] ^ sigB[i];
  return result === 0;
}

/**
 * Basic Auth guard for admin endpoints.
 *
 * Returns `null` when credentials are valid (caller should proceed).
 * Returns a `Response` (401 or 500) when auth fails or env is misconfigured.
 */
export async function checkBasicAuth(request: Request, env: Env): Promise<Response | null> {
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

  // 4. Always evaluate both comparisons before returning (no early exit)
  const [usernameMatch, passwordMatch] = await Promise.all([
    timingSafeEqual(username, env.ADMIN_USERNAME),
    timingSafeEqual(password, env.ADMIN_PASSWORD),
  ]);

  if (usernameMatch && passwordMatch) return null;

  return new Response(null, {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Admin"' },
  });
}
