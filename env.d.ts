/// <reference types="vite/client" />
/// <reference types="@cloudflare/workers-types" />
/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference types="@testing-library/jest-dom" />

import type { Env } from "./worker/types";

declare module "react-router" {
  interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}

interface Window {
  dataLayer: Record<string, unknown>[];
}

declare const __SITE_LAST_UPDATED__: string;
