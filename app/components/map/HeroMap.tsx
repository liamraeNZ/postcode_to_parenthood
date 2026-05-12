/**
 * HeroMap — a simplified map for the landing page hero section.
 *
 * Shows the user's postcode location as a dot on a map with ICB boundary
 * polygons, exactly like the board page mini-map but without the border
 * context panel or board-specific logic.
 */
import { useEffect, useState, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { feature } from 'topojson-client';
import type { Topology, Objects } from 'topojson-specification';
import type { FeatureCollection, GeoJsonProperties } from 'geojson';
import 'leaflet/dist/leaflet.css';

import { MiniMapBoundaryLayer } from './MiniMapBoundaryLayer';
import { UserLocationMarker } from './UserLocationMarker';
import type { MapPolicyEntry } from './IcbBoundaryLayer';

export interface HeroMapProps {
  position: [number, number]; // [lat, lng]
  postcode: string;
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
 */
function computeMaxBounds(position: [number, number]): [[number, number], [number, number]] {
  const [lat, lng] = position;
  const latOffset = 50 / 111;
  const lngOffset = 50 / (111 * Math.cos((lat * Math.PI) / 180));
  return [
    [lat - latOffset, lng - lngOffset],
    [lat + latOffset, lng + lngOffset],
  ];
}

export default function HeroMap({ position, postcode }: HeroMapProps) {
  const [policyMap, setPolicyMap] = useState<Map<string, MapPolicyEntry[]>>(new Map());
  const [geoJsonFeatures, setGeoJsonFeatures] = useState<FeatureCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          console.error('[HeroMap] Data fetch error:', err);
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

  const handleBoardClick = useCallback(() => {}, []);
  const handleVisibleBoardsChange = useCallback(() => {}, []);

  const maxBounds = useMemo(() => computeMaxBounds(position), [position]);

  // Loading state
  if (loading) {
    return (
      <div
        className="w-[28rem] h-[32rem] rounded-xl bg-warm-sand animate-pulse flex items-center justify-center shadow-xl"
        role="status"
        aria-label="Loading map"
      >
        <div className="text-center">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-3 border-sage-green border-t-transparent" />
          <p className="mt-2 text-xs text-deep-slate/60">Loading map…</p>
        </div>
      </div>
    );
  }

  // Error or no data — render nothing (the image will stay)
  if (error || !geoJsonFeatures || geoJsonFeatures.features.length === 0) {
    return null;
  }

  return (
    <div className="w-[28rem] h-[32rem] rounded-xl overflow-hidden ring-1 ring-warm-sand-dark shadow-xl">
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
        <UserLocationMarker position={position} postcodeLabel={postcode} />
      </MapContainer>
    </div>
  );
}
