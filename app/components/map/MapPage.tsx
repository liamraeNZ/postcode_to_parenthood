import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { feature } from 'topojson-client';
import type { Topology, Objects } from 'topojson-specification';
import type { FeatureCollection, GeoJsonProperties } from 'geojson';
import { TreatmentToggle, type TreatmentTypeId } from './TreatmentToggle';
import { IcbBoundaryLayer, type MapPolicyEntry } from './IcbBoundaryLayer';
import { MapLegend } from './MapLegend';
import { IcbInfoPanel } from './IcbInfoPanel';
import 'leaflet/dist/leaflet.css';

const VALID_TREATMENTS: TreatmentTypeId[] = ['ivf', 'icsi', 'iui', 'di', 'fet'];
const DEFAULT_TREATMENT: TreatmentTypeId = 'ivf';
const MAP_CENTER: [number, number] = [52.5, -1.5];
const MAP_ZOOM = 6;

/** Forces Leaflet to recalculate container size after mount */
function InvalidateSize() {
  const map = useMap();
  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM layout is complete
    const raf = requestAnimationFrame(() => {
      map.invalidateSize({ animate: false });
      // Second invalidation after a tick to catch any late layout shifts
      setTimeout(() => map.invalidateSize({ animate: false }), 0);
    });
    return () => cancelAnimationFrame(raf);
  }, [map]);
  return null;
}

interface MapDataResponse {
  data: MapPolicyEntry[];
  request_id: string;
}

// --- Error Boundary ---

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class MapErrorBoundary extends (React.Component as any)<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('[MapPage] Render error:', error);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <p className="text-lg font-semibold text-deep-slate">Something went wrong</p>
            <p className="mt-2 text-sm text-deep-slate/60">
              The map encountered an unexpected error. Please refresh the page.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Helper: parse treatment from URL ---

function parseTreatmentParam(value: string | null): TreatmentTypeId {
  if (value && VALID_TREATMENTS.includes(value as TreatmentTypeId)) {
    return value as TreatmentTypeId;
  }
  return DEFAULT_TREATMENT;
}

// --- Main MapPage content ---

function MapPageContent() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedTreatment = parseTreatmentParam(searchParams.get('treatment'));

  const [policyMap, setPolicyMap] = useState<Map<string, MapPolicyEntry[]>>(new Map());
  const [geoJsonFeatures, setGeoJsonFeatures] = useState<FeatureCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIcbId, setSelectedIcbId] = useState<string | null>(null);

  // Fetch data on mount
  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const [mapDataRes, topoRes] = await Promise.all([
          fetch('/api/map-data'),
          fetch('/data/icb-boundaries.topojson'),
        ]);

        if (!mapDataRes.ok) {
          throw new Error(`Policy data request failed (${mapDataRes.status})`);
        }
        if (!topoRes.ok) {
          throw new Error(`Boundary data request failed (${topoRes.status})`);
        }

        const mapData: MapDataResponse = await mapDataRes.json();
        const topoJson: Topology<Objects<GeoJsonProperties>> = await topoRes.json();

        if (cancelled) return;

        // Build policy map keyed by icb_id
        const pMap = new Map<string, MapPolicyEntry[]>();
        for (const entry of mapData.data) {
          const existing = pMap.get(entry.icb_id);
          if (existing) {
            existing.push(entry);
          } else {
            pMap.set(entry.icb_id, [entry]);
          }
        }
        setPolicyMap(pMap);

        // Convert TopoJSON to GeoJSON
        const objectKeys = Object.keys(topoJson.objects);
        if (objectKeys.length === 0) {
          throw new Error('TopoJSON file contains no objects');
        }
        const firstObjectKey = objectKeys[0];
        const fc = feature(topoJson, topoJson.objects[firstObjectKey]) as unknown as FeatureCollection;
        setGeoJsonFeatures(fc);
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Failed to load map data';
          setError(message);
          console.error('[MapPage] Data fetch error:', err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, []);

  // Treatment change handler — updates URL search param
  const handleTreatmentChange = useCallback(
    (id: TreatmentTypeId) => {
      setSearchParams({ treatment: id }, { replace: true });
    },
    [setSearchParams]
  );

  // ICB click handler
  const handleIcbClick = useCallback((icbId: string) => {
    setSelectedIcbId(icbId);
  }, []);

  // ICB hover handler (currently no-op for state, handled by layer)
  const handleIcbHover = useCallback((_icbId: string | null) => {
    // Hover state is managed within IcbBoundaryLayer via tooltips
  }, []);

  // Close info panel
  const handleClosePanel = useCallback(() => {
    setSelectedIcbId(null);
  }, []);

  // Get selected ICB info for the panel
  const selectedIcbInfo = useMemo(() => {
    if (!selectedIcbId) return null;
    const entries = policyMap.get(selectedIcbId);
    if (!entries || entries.length === 0) return null;
    const policyForTreatment = entries.find((e) => e.treatment_type_id === selectedTreatment) ?? null;
    return {
      icbId: selectedIcbId,
      icbName: entries[0].icb_name,
      policy: policyForTreatment,
    };
  }, [selectedIcbId, policyMap, selectedTreatment]);

  // Loading state
  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center p-8">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-sage-green border-t-transparent" role="status">
            <span className="sr-only">Loading map…</span>
          </div>
          <p className="mt-3 text-sm text-deep-slate/60">Loading map data…</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-lg font-semibold text-deep-slate">Map temporarily unavailable</p>
          <p className="mt-2 text-sm text-deep-slate/60">{error}</p>
        </div>
      </div>
    );
  }

  // Empty state (no features)
  if (!geoJsonFeatures || geoJsonFeatures.features.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-lg font-semibold text-deep-slate">No boundary data available</p>
          <p className="mt-2 text-sm text-deep-slate/60">
            The map boundary data could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {/* Treatment toggle - overlaid on map */}
      <div className="absolute top-3 right-3 z-[1000] rounded-xl bg-white shadow-md px-3 py-2">
        <p className="text-xs font-semibold text-deep-slate/70 mb-1">Treatment type</p>
        <TreatmentToggle selected={selectedTreatment} onChange={handleTreatmentChange} />
      </div>

      {/* Map container */}
      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_ZOOM}
        scrollWheelZoom={true}
        preferCanvas={true}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <InvalidateSize />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <IcbBoundaryLayer
          geoJsonFeatures={geoJsonFeatures}
          policyMap={policyMap}
          selectedTreatment={selectedTreatment}
          onIcbHover={handleIcbHover}
          onIcbClick={handleIcbClick}
        />
        <MapLegend />
      </MapContainer>

      {/* Info panel overlay */}
      {selectedIcbInfo && (
        <IcbInfoPanel
          icbId={selectedIcbInfo.icbId}
          icbName={selectedIcbInfo.icbName}
          policy={selectedIcbInfo.policy}
          onClose={handleClosePanel}
        />
      )}
    </div>
  );
}

// --- Exported MapPage with error boundary ---

export function MapPage() {
  return (
    <MapErrorBoundary>
      <MapPageContent />
    </MapErrorBoundary>
  );
}
