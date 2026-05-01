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

export type Env = {
  ASSETS: Fetcher;
  DB: D1Database;
  r2bucket: R2Bucket;
  ADMIN_USERNAME?: string;
  ADMIN_PASSWORD?: string;
};

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
