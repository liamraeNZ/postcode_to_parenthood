/**
 * MapContent — lazy-loadable wrapper for the interactive Leaflet map.
 *
 * This file is the dynamic-import boundary used by `app/routes/map.tsx`:
 *   const LazyMapContent = lazy(() => import("../components/map/MapContent"));
 *
 * All Leaflet-dependent code lives inside MapPage (imported below), which
 * imports `react-leaflet`, `leaflet/dist/leaflet.css`, and other browser-only
 * modules. By keeping the import chain rooted here, none of that code is
 * pulled into the server bundle or evaluated during SSR.
 */
import { MapPage } from "./MapPage";

export default function MapContent() {
  return <MapPage />;
}
