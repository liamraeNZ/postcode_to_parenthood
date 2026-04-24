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
};

export type R2Bucket = {
  list: (options?: { prefix?: string; delimiter?: string; cursor?: string; limit?: number }) => Promise<{
    objects: { key: string; size: number; uploaded: Date; httpMetadata?: { contentType?: string } }[];
    truncated: boolean;
    cursor?: string;
    delimitedPrefixes: string[];
  }>;
  get: (key: string) => Promise<{
    body: ReadableStream;
    httpMetadata?: { contentType?: string };
    size: number;
  } | null>;
};

export type Env = {
  ASSETS: Fetcher;
  DB: D1Database;
  r2bucket: R2Bucket;
  ADMIN_USERNAME?: string;
  ADMIN_PASSWORD?: string;
};

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
