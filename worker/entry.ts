import { syncIcbsFromOrd } from '../scripts/syncIcbsFromOrd';
import { getPath, getStringPath, log, requestId } from './lib';
import type { Env, ExportedHandler, ScheduledController } from './types';
import { handleApiRequest } from './handlers/api';
import { fetchOrdJson } from './services/ord';

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
      return handleApiRequest(request, env);
    }
    return env.ASSETS.fetch(request);
  },
  async scheduled(controller: ScheduledController, env: Env) {
    const reqId = requestId();
    const startedAt = Date.now();
    try {
      log('info', 'scheduled sync start', { request_id: reqId, cron: controller.cron });
      const result = await syncIcbsFromOrd(env.DB, { requestId: reqId }, { fetchOrdJson, getPath, getStringPath });
      log('info', 'scheduled sync end', { request_id: reqId, duration_ms: Date.now() - startedAt, ...result });
    } catch (err) {
      log('error', 'scheduled sync failed', {
        request_id: reqId,
        duration_ms: Date.now() - startedAt,
        err: err instanceof Error ? { name: err.name, message: err.message, stack: err.stack } : err
      });
    }
  }
} satisfies ExportedHandler<Env>;
