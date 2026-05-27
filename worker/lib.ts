import type { LogLevel } from './types';

// Re-export shared postcode utilities from the single source of truth
import {
  normalizePostcode as _normalizePostcode,
  normalizeOdsCode as _normalizeOdsCode,
  redactPostcodeForLogs as _redactPostcodeForLogs,
  isReasonablePostcodeInput as _isReasonablePostcodeInput,
} from '../app/lib/postcode';

export const normalizePostcode = _normalizePostcode;
export const normalizeOdsCode = _normalizeOdsCode;
export const redactPostcodeForLogs = _redactPostcodeForLogs;
export const isReasonablePostcodeInput = _isReasonablePostcodeInput;

export function log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  const payload = {
    level,
    message,
    ...meta
  };
  if (level === 'error') {
    console.error(JSON.stringify(payload));
  } else if (level === 'warn') {
    console.warn(JSON.stringify(payload));
  } else if (level === 'info') {
    console.log(JSON.stringify(payload));
  } else {
    console.debug(JSON.stringify(payload));
  }
}

export function requestId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}

export function jsonResponse(body: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set('content-type', 'application/json; charset=utf-8');

  return new Response(JSON.stringify(body), {
    ...init,
    headers
  });
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export async function readJsonBody(request: Request, options: { maxBytes: number }) {
  const buffer = await request.arrayBuffer();
  if (buffer.byteLength > options.maxBytes) {
    return { ok: false as const, error: 'Body too large' as const };
  }
  let parsed: unknown;
  try {
    const text = new TextDecoder().decode(buffer);
    parsed = text ? (JSON.parse(text) as unknown) : null;
  } catch {
    return { ok: false as const, error: 'Invalid JSON' as const };
  }
  return { ok: true as const, value: parsed };
}

export function truncateForLogs(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength)}…`;
}

export function sanitizeSearchParams(params: URLSearchParams) {
  const out: Record<string, string> = {};
  params.forEach((value, key) => {
    if (key === 'postcode') {
      out[key] = redactPostcodeForLogs(normalizePostcode(value));
      return;
    }
    out[key] = truncateForLogs(value, 80);
  });
  return Object.keys(out).length ? out : undefined;
}

export function isReasonableOrgNameInput(input: string) {
  const trimmed = input.trim();
  if (trimmed.length < 3) return false;
  if (trimmed.length > 80) return false;
  return /^[A-Za-z0-9 '&(),.\-]+$/.test(trimmed);
}

export async function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

export function getStringField(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

export function getNumberField(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

export function getPath(obj: unknown, path: string[]): unknown {
  let current: unknown = obj;
  for (const key of path) {
    if (!isRecord(current)) return undefined;
    current = current[key];
  }
  return current;
}

export function getStringPath(obj: unknown, path: string[]): string | null {
  return getStringField(getPath(obj, path));
}

export function getNumberPath(obj: unknown, path: string[]): number | null {
  return getNumberField(getPath(obj, path));
}

export function haversineDistanceMeters(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number }
) {
  const toRad = (degrees: number) => (degrees * Math.PI) / 180;
  const r = 6371e3;
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
  return 2 * r * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}
