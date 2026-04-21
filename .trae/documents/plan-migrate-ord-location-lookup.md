# Plan: Migrate location lookup from postcodes.io to NHS ORD API

## Summary
- Replace the current “postcode → ICB policy” lookup (powered by postcodes.io) with the NHS Organisation Data Service (ORD) workflow: postcode → GP practice list → selected GP → parent ICB/Sub-ICB ODS code → policy lookup from D1.
- Keep all ORD calls server-side in the existing Cloudflare Worker (`worker.ts`) to avoid CORS issues and to ensure the ORD `Accept: application/json` requirement is always applied.
- Refactor the existing postcode search UI to support GP selection and to display policy results based on the extracted parent ODS code.

## Current State Analysis (from repo inspection)
- Backend lookup is currently postcode-based and calls `https://api.postcodes.io/postcodes/{postcode}` in `lookupIcbPolicyByPostcode` ([worker.ts](file:///Users/liam.rae-mclauchlan/dev/personal/FertilityFund/worker.ts#L152-L260)), then resolves an ICB via `icbs.nhs_code` / `icb_aliases`, then loads the latest policy from D1.
- Frontend calls the backend via `lookupICBByPostcode` ([postcodeService.ts](file:///Users/liam.rae-mclauchlan/dev/personal/FertilityFund/src/services/postcodeService.ts#L77-L231)) and renders the returned `ICBPolicy` in `PostcodeSearch` ([PostcodeSearch.tsx](file:///Users/liam.rae-mclauchlan/dev/personal/FertilityFund/src/components/home/PostcodeSearch.tsx)).
- There is no `useLocation` hook; equivalent state currently lives directly inside `PostcodeSearch`.
- The app is Vite + Cloudflare Worker serving assets (`run-dev.sh` builds `dist/` and `wrangler dev` serves both assets + `/api/*` routes), so same-origin API calls are the default and CORS is avoided when ORD calls are proxied through the Worker.

## Proposed Changes

### 1) Worker: Add ORD proxy endpoints and replace postcodes.io dependency
**Files**
- [worker.ts](file:///Users/liam.rae-mclauchlan/dev/personal/FertilityFund/worker.ts)

**What**
- Introduce ORD fetch helpers:
  - `fetchOrdJson(url, { timeoutMs, requestId })` that always includes `Accept: application/json` and applies an abort timeout (similar to existing `fetchWithTimeout`).
  - Minimal runtime-shape parsing to safely extract required fields without depending on a full OpenAPI schema.
- Add API endpoints:
  1. `GET /api/gp-practices?postcode=...`
     - Calls ORD search:
       - `https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations?PostCode={POSTCODE}&PrimaryRoleId=RO177&Status=Active`
       - Note: ORD docs use `PostCode` (capital C); we will send `PostCode` upstream even if clients send `postcode`.
     - Returns a simplified JSON list:
       - `[{ odsCode, name, postcode, orgLink }]`
  2. `GET /api/gp-icb?odsCode=...`
     - Calls ORD read:
       - `https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations/{ODS_CODE}`
     - Implements `getIcbFromGpOds(odsCode)` server-side to:
       - Find an “Active” relationship whose `Target.PrimaryRoleId.id` is `RO318` (ICB) or `RO210` (Sub-ICB Location).
       - Extract `Target.OrgId.extension` (parent ODS code).
       - Decision: prefer `RO318` if multiple matches exist; otherwise use `RO210`.
     - Returns:
       - `{ icbCode, relationshipRoleId }` (plus optional `gpName` for debugging/UI display if available).
  3. `GET /api/icb-policy?icbCode=E...`
     - New variant that looks up policy directly by parent ICB/Sub-ICB ODS code:
       - Reuse existing `resolveIcbId(db, icbCode, null)` and the existing policy query.
     - The existing `?postcode=` variant will be removed or will return `400` with a migration message (so we don’t silently keep using postcodes.io).

**Why**
- Centralizes ORD requirements (especially `Accept: application/json`) and avoids browser CORS restrictions against `spineservices.nhs.uk`.
- Keeps the policy lookup (D1) in the backend and only returns the already-defined `ICBPolicy` to the frontend.

**Error handling**
- `GET /api/gp-practices`:
  - `404` when ORD returns no organisations for that postcode.
  - `502` when ORD is unavailable or returns non-JSON/non-OK.
- `GET /api/gp-icb`:
  - `404` when GP record exists but no qualifying `Rels` mapping is found.
  - `502` for upstream failures.
- `GET /api/icb-policy`:
  - `404` when no policy is found for the resolved ICB id.
  - `400` for missing/invalid `icbCode`.

### 2) Frontend service layer: Replace postcodeService with ORD workflow calls
**Files**
- [postcodeService.ts](file:///Users/liam.rae-mclauchlan/dev/personal/FertilityFund/src/services/postcodeService.ts)

**What**
- Refactor the service module to expose three functions (keeping the existing timeout/network error mapping patterns):
  - `searchGpPracticesByPostcode(postcode): Promise<GpPracticeSummary[]>`
  - `getIcbFromGpOds(odsCode): Promise<{ icbCode: string }>` (frontend utility that calls the backend route; matches the requested name)
  - `lookupICBPolicyByIcbCode(icbCode): Promise<ICBPolicy | null>`
- Keep `VITE_API_BASE_URL` behavior unchanged (relative `/api/...` by default).
- Update/rename error types to reflect the new endpoints (or keep the existing `PostcodeLookupError` but broaden it to “LocationLookupError” if it improves clarity).

### 3) UI: Refactor PostcodeSearch to include GP selection and new states
**Files**
- [PostcodeSearch.tsx](file:///Users/liam.rae-mclauchlan/dev/personal/FertilityFund/src/components/home/PostcodeSearch.tsx)

**What**
- Replace the single “Find Policy” action with a 2-step flow:
  1. Postcode search loads GP practices list (`gpResults`) and displays it as a selectable list.
  2. Selecting a GP triggers:
     - `getIcbFromGpOds(selectedGp.odsCode)` → sets `icbCode`
     - `lookupICBPolicyByIcbCode(icbCode)` → sets `result`
- Add state (the “useLocation equivalent”):
  - `gpPractices: GpPracticeSummary[] | null`
  - `selectedGP: GpPracticeSummary | null`
  - `icbCode: string | null`
  - Existing `loading`, `error`, `result` states updated to support the new flow.
- Add empty/error states:
  - “No GP practices found for that postcode”
  - “We couldn’t determine the ICB for that GP practice”

**UX decisions**
- Keep the UI within the current component (no new hook) to minimize surface area, since the repo does not currently use custom hooks for this feature.
- Keep input responsive by separating loading indicators:
  - `loadingSearch` (postcode → list)
  - `loadingSelect` (GP → ICB → policy)

### 4) Types: Add minimal GP practice types
**Files**
- [types.ts](file:///Users/liam.rae-mclauchlan/dev/personal/FertilityFund/src/types.ts) (or a new `src/types/ord.ts` if preferred)

**What**
- Add a `GpPracticeSummary` type used by `PostcodeSearch` and the service layer:
  - `odsCode: string`
  - `name: string`
  - `postcode?: string`

## Assumptions & Decisions
- ORD calls will be executed only from the Worker (server-side); the browser never calls `directory.spineservices.nhs.uk` directly.
- Parent lookup precedence: use `RO318` (ICB) first, otherwise fall back to `RO210` (Sub-ICB Location).
- D1 mapping uses ODS-style codes like `E54000029` in `icbs.nhs_code` (confirmed by seed data in [0001_init.sql](file:///Users/liam.rae-mclauchlan/dev/personal/FertilityFund/migrations/0001_init.sql#L107-L119)).
- The final “eligibility result” in this repo currently means “the correct `ICBPolicy` row is retrieved and displayed”; no additional eligibility computation exists today.

## Verification Steps
- Run typecheck/lint: `npm run lint`.
- Run local dev: `npm run dev`, then verify in browser:
  - Enter a postcode that should return GP practices; confirm list renders.
  - Select a GP; confirm the UI shows policy tied to the extracted `icbCode`.
- API sanity checks (local):
  - `GET /api/gp-practices?postcode=...` returns JSON and includes GP ODS codes.
  - `GET /api/gp-icb?odsCode=...` returns `{ icbCode }` or a clear 404 with error JSON.
  - `GET /api/icb-policy?icbCode=...` returns `ICBPolicy`.

