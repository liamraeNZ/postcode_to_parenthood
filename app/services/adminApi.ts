import type {
  AdminIcb,
  AdminPolicy,
  CreateIcbInput,
  UpdateIcbInput,
  CreatePolicyInput,
} from '../types/admin';

export class ConnectionError extends Error {
  constructor(cause?: unknown) {
    super('Connection error — please try again');
    this.name = 'ConnectionError';
    if (cause instanceof Error) this.cause = cause;
  }
}

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown) {
    super(`API error: ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

async function apiFetch(url: string, init?: RequestInit): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(url, init);
  } catch (err) {
    throw new ConnectionError(err);
  }

  if (!response.ok) {
    let body: unknown;
    try {
      body = await response.json();
    } catch {
      body = await response.text().catch(() => null);
    }
    throw new ApiError(response.status, body);
  }

  return response.json();
}

export async function listIcbs(): Promise<AdminIcb[]> {
  const data = await apiFetch('/api/admin/icbs') as { icbs: AdminIcb[] };
  return data.icbs;
}

export async function createIcb(data: CreateIcbInput): Promise<AdminIcb> {
  const result = await apiFetch('/api/admin/icbs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }) as { icb: AdminIcb };
  return result.icb;
}

export async function updateIcb(id: string, data: UpdateIcbInput): Promise<AdminIcb> {
  const result = await apiFetch(`/api/admin/icbs/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }) as { icb: AdminIcb };
  return result.icb;
}

export async function listPoliciesForIcb(icbId: string): Promise<AdminPolicy[]> {
  const data = await apiFetch(`/api/admin/icbs/${icbId}/policies`) as { policies: AdminPolicy[] };
  return data.policies;
}

export async function createPolicy(icbId: string, data: CreatePolicyInput): Promise<AdminPolicy> {
  const result = await apiFetch(`/api/admin/icbs/${icbId}/policies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }) as { policy: AdminPolicy };
  return result.policy;
}
