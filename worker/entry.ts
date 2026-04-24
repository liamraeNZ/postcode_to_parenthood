import type { Env, ExportedHandler } from './types';
import { handleApiRequest } from './handlers/api';

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
      return handleApiRequest(request, env);
    }
    return env.ASSETS.fetch(request);
  }
} satisfies ExportedHandler<Env>;
