# Postcode to Parenthood

Postcode to Parenthood is a web app that helps UK residents navigate the IVF postcode lottery. Enter a postcode and it maps you to your local NHS Integrated Care Board (ICB), then displays the fertility treatment policy for that area, including cycle entitlements, age limits, BMI criteria, wait times, and additional notes.

Live at [postcodetoparenthood.org.uk](https://postcodetoparenthood.org.uk)

## What it does

- Looks up your NHS ICB from a postcode and summarises key policy details (cycles offered, age range, BMI limits, wait times)
- Presents local eligibility rules as clear, human-readable guidance
- Shows an interactive map of the UK with ICB boundaries and policy data colour-coded
- Provides individual board pages with full policy breakdowns and source documents
- Covers England (ICBs) and devolved nations (Health Boards in Scotland, Wales, Northern Ireland)

This project is informational only. It is not medical, legal, or financial advice. Always confirm details with your ICB or clinic directly.

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | React Router v7 (file-based routing, SSR) + Vite |
| Runtime | Cloudflare Workers |
| Frontend | React 19, Tailwind CSS v4, Motion, Leaflet + react-leaflet |
| Database | Cloudflare D1 (SQLite) |
| Storage | Cloudflare R2 (policy PDFs, boundary GeoJSON) |
| Language | TypeScript ~5.8, strict, ESM-only |
| Testing | Vitest, fast-check, @cloudflare/vitest-plugin, Testing Library |

## Getting started

### Prerequisites

- Node.js 20+
- npm
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (installed as a dev dependency, but useful globally too)

### Setup

```bash
# Install dependencies
npm install

# Create a .dev.vars file for local secrets
cp .dev.vars.example .dev.vars
# Then fill in ADMIN_USERNAME, ADMIN_PASSWORD, and any API keys

# Apply D1 migrations locally
npm run cf:migrate:local

# Start the dev server
npm run dev
```

The dev server runs at `http://localhost:5173` with a Cloudflare proxy providing local D1 and R2 bindings.

### Environment variables

Create a `.dev.vars` file in the project root with:

```
ADMIN_USERNAME=<your-admin-username>
ADMIN_PASSWORD=<your-admin-password>
```

These are used for the admin panel authentication. Additional keys (R2 access, Gemini API) are only needed for specific scripts.

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server with Cloudflare proxy |
| `npm run build` | Production build via react-router build |
| `npm run preview` | Run production build locally via wrangler dev |
| `npm run deploy` | Deploy to Cloudflare Workers |
| `npm run lint` | TypeScript type-check (both tsconfigs) |
| `npm test` | Run all tests (workers + components) |
| `npm run test:workers` | Worker/integration tests only |
| `npm run test:components` | Component tests only |
| `npm run cf:migrate:local` | Apply D1 migrations locally |
| `npm run cf:migrate:remote` | Apply D1 migrations to production |
| `npm run fetch-boundaries` | Fetch ICB boundary GeoJSON from ONS |
| `npm run generate-ons-ods` | Generate ONS-to-ODS code mapping |

## Project structure

```
├── app/                    # React Router frontend application
│   ├── components/         # UI components grouped by domain
│   ├── data/               # Static data files (JSON mappings)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Shared logic (slugs, meta, utils)
│   ├── routes/             # File-based routes (React Router v7)
│   ├── services/           # Client-side service modules
│   ├── types/              # Shared TypeScript types
│   └── utils/              # Utility functions
├── worker/                 # Cloudflare Worker backend
│   ├── entry.ts            # Fetch handler (routes API, documents, SSR)
│   ├── handlers/           # Request handlers
│   ├── services/           # Backend services (ICB policy, postcodes.io, ODS)
│   ├── auth.ts             # Admin authentication
│   └── types.ts            # Env type definitions (D1, R2 bindings)
├── migrations/             # D1 SQL migration files (0001_ through 0017_)
├── scripts/                # Build and data scripts
├── geojson/                # GeoJSON/TopoJSON boundary data
├── documents/              # Source policy documents
├── public/                 # Static assets
├── worker.ts               # Worker entry point (re-exports worker/entry)
├── wrangler.toml           # Cloudflare Workers configuration
└── vite.config.ts          # Vite config (Cloudflare proxy, Tailwind, aliases)
```

### Routing architecture

The Worker entry point routes requests as follows:

- `/api/*` goes to worker handlers (D1 queries, postcode lookups, policy data)
- `/documents/*` serves PDFs directly from R2
- Static assets (`/assets/`, `/data/`, favicons) are served from the ASSETS binding
- Everything else goes through React Router SSR

### Key pages

- `/` — Homepage with postcode search
- `/map` — Interactive UK map with ICB boundaries
- `/boards` — List of all ICBs/Health Boards
- `/board/:slug` — Individual board policy page
- `/search` — Postcode search results
- `/about`, `/glossary`, `/sources` — Information pages
- `/what-next/eligible`, `/what-next/exploring-options` — Guidance pages
- `/admin` — Admin panel (protected)

## Database

The project uses Cloudflare D1 (SQLite). Migrations live in `migrations/` and are numbered sequentially. The schema covers ICBs, policies, document metadata, updates, borough mappings, and data confidence levels.

Apply migrations locally with `npm run cf:migrate:local` and to production with `npm run cf:migrate:remote`.

## Deployment

The site deploys to Cloudflare Workers at postcodetoparenthood.org.uk.

```bash
# Build and deploy
npm run deploy

# Or full deploy including R2 boundary upload
npm run deploy:full
```

Production secrets (ADMIN_USERNAME, ADMIN_PASSWORD) are set via `wrangler secret put`.

## Testing

Two test configurations exist:

- **Worker/integration tests** (`vitest.config.ts`) — run against real D1/R2 bindings using `@cloudflare/vitest-plugin`
- **Component tests** (`vitest.config.components.ts`) — use happy-dom for React component testing

Property-based tests use fast-check and are suffixed `.property.test.ts`.

```bash
npm test                    # Run everything
npm run test:workers        # Worker tests only
npm run test:components     # Component tests only
```

## Path alias

`@/` maps to `./app/` in both TypeScript and Vite config. Use it for all app-internal imports.
