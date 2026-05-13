/**
 * MiniMapContent — lazy-loadable wrapper for the mini-map on the board policy page.
 *
 * This file is the dynamic-import boundary for the mini-map. All Leaflet-dependent
 * code (react-leaflet, leaflet CSS, topojson-client) is imported here so that none
 * of it is pulled into the server bundle or evaluated during SSR.
 *
 * Utint:
 *   const LazyMiniMapContent = lazy(() => import("../components/map/MiniMapContent"));
 */
import { useEffect, useState, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { feature } from 'topojson-client';
import type { Topology, Objects } from 'topojson-specification';
import type { FeatureCollection, GeoJsonProperties } from 'geojson';
import 'leaflet/dist/leaflet.css';

import { MiniMapBoundaryLayer, type VisibleBoard } from './MiniMapBoundaryLayer';
import { UserLocationMarker } from './UserLocationMarker';
import { BorderContextPanel } from './BorderContextPanel';
import type { MapPolicyEntry } from './IcbBoundaryLayer';
import { toSlug } from '../../lib/slug';

export interface MiniMapContentProps {
  position: [number, number]; // [lat, lng]
  gpPostcode: string;
  currentBoardId: string;
  currentBoardName: string;
}

interface MapDataResponse {
  data: MapPolicyEntry[];
  request_id: string;
}

/** Forces Leaflet to recalculate container size after mount */
function InvalidateSize() {
  const map = useMap();
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      map.invalidateSize({ animate: false });
      setTimeout(() => map.invalidateSize({ animate: false }), 0);
    });
    return () => cancelAnimationFrame(raf);
  }, [map]);
  return null;
}

/**
 * Computes max bounds as a ~50km radius around the user's position.
 * 1 degree latitude ≈ 111km, 1 degree longitude ≈ 111km * cos(lat)
 */
function computeMaxBounds(position: [number, number]): [[number, number], [number, number]] {
  const [lat, lng] = position;
  const latOffset = 50 / 111; // ~0.45 degrees
  const lngOffset = 50 / (111 * Math.cos((lat * Math.PI) / 180));
  return [
    [lat - latOffset, lng - lngOffset],
    [lat + latOffset, lng + lngOffset],
  ];
}

export default function MiniMapContent({
  position,
  gpPostcode,
  currentBoardId,
  currentBoardName,
}: MiniMapContentProps) {
  const [policyMap, setPolicyMap] = useState<Map<string, MapPolicyEntry[]>>(new Map());
  const [geoJsonFeatures, setGeoJsonFeatures] = useState<FeatureCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleBoards, setVisibleBoards] = useState<VisibleBoard[]>([]);

  // Fetch boundary and policy data in parallel
  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const [mapDataRes, topoRes] = await Promise.all([
          fetch('/api/map-data'),
          fetch('/api/geodata/boundaries'),
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

        // Build policy map keyed by board_id
        const pMap = new Map<string, MapPolicyEntry[]>();
        for (const entry of mapData.data) {
          const existing = pMap.get(entry.board_id);
          if (existing) {
            existing.push(entry);
          } else {
            pMap.set(entry.board_id, [entry]);
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
          console.error('[MiniMapContent] Data fetch error:', err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  // Handle board click — no-op; the Leaflet popup (with "View policy" link) handles navigation
  const handleBoardClick = useCallback((_boardId: string, _boardName: string) => {
    // Intentionally empty: clicking an ICB opens the bound popup which contains
    // the board info and a "View policy" link for navigation.
  }, []);

  // Handle visible boards change from the boundary layer
  const handleVisibleBoardsChange = useCallback(
    (boards: VisibleBoard[]) => {
      // Exclude the current board from the neighbours list
      const neighbours = boards.filter((b) => b.boardId !== currentBoardId);
      setVisibleBoards(neighbours);
    },
    [currentBoardId]
  );

  // Compute max bounds for pan constraint
  const maxBounds = useMemo(() => computeMaxBounds(position), [position]);

  // Derive current board info for the context panel
  const currentBoardInfo = useMemo(() => {
    const entries = policyMap.get(currentBoardId);
    const ivfEntry = entries?.find((e) => e.treatment_type_id === 'ivf') ?? null;
    return {
      id: currentBoardId,
      name: currentBoardName,
      cyclesOffered: ivfEntry?.cycles_offered ?? null,
    };
  }, [policyMap, currentBoardId, currentBoardName]);

  // Derive neighbours for the context panel
  const neighboursForPanel = useMemo(() => {
    return visibleBoards.map((board) => ({
      id: board.boardId,
      name: board.boardName,
      cyclesOffered: board.cyclesOffered,
      slug: board.documentFolderName ? toSlug(board.documentFolderName) : null,
    }));
  }, [visibleBoards]);

  // Loading state
  if (loading) {
    return (
      <div
        className="h-[200px] sm:h-[300px] w-full rounded-lg bg-warm-canvas animate-pulse flex items-center justify-center"
        role="status"
        aria-label="Loading map"
      >
        <div className="text-center">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-3 border-tint border-t-transparent" />
          <p className="mt-2 text-xs text-deep-slate/60">Loading map…</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className="h-[200px] sm:h-[300px] w-full rounded-lg bg-warm-canvas/50 flex items-center justify-center"
        role="alert"
      >
        <div className="text-center px-4">
          <p className="text-sm font-medium text-deep-slate">Map unavailable</p>
          <p className="mt-1 text-xs text-deep-slate/60">
            Unable to load boundary data. The rest of the page is unaffected.
          </p>
        </div>
      </div>
    );
  }

  // No features loaded
  if (!geoJsonFeatures || geoJsonFeatures.features.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Map container */}
      <div className="h-[200px] sm:h-[300px] w-full rounded-lg overflow-hidden ring-1 ring-canvas-dark">
        <MapContainer
          center={position}
          zoom={10}
          minZoom={8}
          maxZoom={13}
          maxBounds={maxBounds}
          maxBoundsViscosity={1.0}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <InvalidateSize />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
          />
          <MiniMapBoundaryLayer
            geoJsonFeatures={geoJsonFeatures}
            policyMap={policyMap}
            onBoardClick={handleBoardClick}
            onVisibleBoardsChange={handleVisibleBoardsChange}
          />
          <UserLocationMarker position={position} postcodeLabel={gpPostcode} />
        </MapContainer>
      </div>

      {/* Border context panel */}
      <BorderContextPanel
        currentBoard={currentBoardInfo}
        neighbours={neighboursForPanel}
        loading={false}
      />
    </div>
  );
}
