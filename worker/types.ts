export type ExecutionContext = {
  waitUntil: (promise: Promise<unknown>) => void;
  passThroughOnException: () => void;
};

export type Fetcher = {
  fetch: (request: Request) => Promise<Response>;
};

export type D1Database = {
  prepare: (query: string) => {
    bind: (...values: unknown[]) => {
      first: <T>(typeHint?: string) => Promise<T | null>;
      run: () => Promise<{ success: boolean; error?: string }>;
      all: <T>() => Promise<{ results: T[] }>;
    };
  };
};

export type ExportedHandler<E> = {
  fetch: (request: Request, env: E, ctx: ExecutionContext) => Response | Promise<Response>;
  scheduled?: (controller: ScheduledController, env: E, ctx: ExecutionContext) => void | Promise<void>;
};

export type ScheduledController = {
  cron: string;
  scheduledTime: number;
};

export type Env = {
  ASSETS: Fetcher;
  DB: D1Database;
  ADMIN_TOKEN?: string;      // existing — kept for icb-sync backward compat
  ADMIN_USERNAME?: string;   // new
  ADMIN_PASSWORD?: string;   // new
};

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
