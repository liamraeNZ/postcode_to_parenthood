import { useCallback, useEffect } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import type { Layer, PathOptions } from 'leaflet';
import L from 'leaflet';
import type { Feature, GeoJsonProperties } from 'geojson';
import { getMapFillColor } from '@/utils/mapColors';
import { getBoardCode } from '@/utils/codeLookup';
import { toSlug } from '@/lib/slug';
import { MAP_UI } from '@/utils/theme';
import type { MapPolicyEntry } from './IcbBoundaryLayer';

export interface VisibleBoard {
  boardId: string;
  boardName: string;
  cyclesOffered: number | null;
  documentFolderName: string | null;
}

export interface MiniMapBoundaryLayerProps {
  geoJsonFeatures: GeoJSON.FeatureCollection;
  policyMap: Map<string, MapPolicyEntry[]>;
  onBoardClick: (boardId: string, boardName: string) => void;
  onVisibleBoardsChange: (boards: VisibleBoard[]) => void;
}

const DEFAULT_STYLE: PathOptions = {
  weight: 1,
  color: MAP_UI.border,
  opacity: 0.7,
  fillOpacity: 0.7,
};

function getIvfEntry(
  policyMap: Map<string, MapPolicyEntry[]>,
  onsCode: string
): MapPolicyEntry | null {
  const boardCode = getBoardCode(onsCode);
  if (!boardCode) return null;

  const entries = policyMap.get(boardCode);
  if (!entries) return null;

  return entries.find((e) => e.treatment_type_id === 'ivf') ?? null;
}

function getOnsCode(properties: GeoJsonProperties): string {
  if (!properties) return '';
  return properties.icb23cd ?? properties.ICB23CD ?? properties.board_cd ?? '';
}

function getBoardName(properties: GeoJsonProperties, entry: MapPolicyEntry | null): string {
  if (entry) return entry.board_name;
  if (!properties) return 'Unknown health board';
  return properties.icb23nm ?? properties.ICB23NM ?? properties.board_nm ?? 'Unknown health board';
}

/**
 * MiniMapBoundaryLayer renders GeoJSON health board polygons on the mini-map,
 * colored by IVF cycles offered. It detects which boards are visible in the
 * current viewport and reports them via onVisibleBoardsChange.
 */
export function MiniMapBoundaryLayer({
  geoJsonFeatures,
  policyMap,
  onBoardClick,
  onVisibleBoardsChange,
}: MiniMapBoundaryLayerProps) {
  const map = useMap();

  const computeVisibleBoards = useCallback(() => {
    const bounds = map.getBounds();
    const visible: VisibleBoard[] = [];

    for (const feature of geoJsonFeatures.features) {
      const props = feature.properties;
      const onsCode = getOnsCode(props);
      const boardCode = getBoardCode(onsCode);
      if (!boardCode) continue;

      // Check if feature bounding box intersects the map viewport
      const featureLayer = L.geoJSON(feature as GeoJSON.Feature);
      const featureBounds = featureLayer.getBounds();
      if (!bounds.intersects(featureBounds)) continue;

      const entry = getIvfEntry(policyMap, onsCode);
      visible.push({
        boardId: boardCode,
        boardName: getBoardName(props, entry),
        cyclesOffered: entry?.cycles_offered ?? null,
        documentFolderName: entry?.document_folder_name ?? null,
      });
    }

    onVisibleBoardsChange(visible);
  }, [map, geoJsonFeatures, policyMap, onVisibleBoardsChange]);

  // Compute visible boards after initial render and on map move/zoom
  useEffect(() => {
    computeVisibleBoards();

    map.on('moveend', computeVisibleBoards);
    map.on('zoomend', computeVisibleBoards);

    return () => {
      map.off('moveend', computeVisibleBoards);
      map.off('zoomend', computeVisibleBoards);
    };
  }, [map, computeVisibleBoards]);

  const style = useCallback(
    (feature: Feature<GeoJSON.Geometry, GeoJsonProperties> | undefined): PathOptions => {
      if (!feature?.properties) {
        return { ...DEFAULT_STYLE, fillColor: getMapFillColor(null) };
      }

      const onsCode = getOnsCode(feature.properties);
      const entry = getIvfEntry(policyMap, onsCode);
      const cycles = entry ? entry.cycles_offered : null;

      return {
        ...DEFAULT_STYLE,
        fillColor: getMapFillColor(cycles),
      };
    },
    [policyMap]
  );

  const onEachFeature = useCallback(
    (feature: Feature<GeoJSON.Geometry, GeoJsonProperties>, layer: Layer) => {
      const props = feature.properties;
      if (!props) return;

      const onsCode = getOnsCode(props);
      const boardCode = getBoardCode(onsCode);
      const entry = getIvfEntry(policyMap, onsCode);
      const boardName = getBoardName(props, entry);
      const cycles = entry ? entry.cycles_offered : null;
      const documentFolderName = entry?.document_folder_name ?? null;

      // Bind tooltip showing board name and cycles offered (on hover)
      const tooltipContent = cycles !== null
        ? `${boardName}: ${cycles} cycle${cycles !== 1 ? 's' : ''} offered`
        : `${boardName}: No data`;
      layer.bindTooltip(tooltipContent, { sticky: true, direction: 'top' });

      // Build popup content with board name, cycles, and navigation link
      const cyclesText = cycles !== null
        ? `${cycles} cycle${cycles !== 1 ? 's' : ''} offered`
        : 'No data available';
      const linkHtml = documentFolderName
        ? `<a href="/board/${toSlug(documentFolderName)}" class="text-blue-600 underline hover:text-blue-800">View policy</a>`
        : '';
      const popupHtml = `
        <div class="text-sm">
          <strong>${boardName}</strong><br/>
          <span>${cyclesText}</span><br/>
          ${linkHtml}
        </div>
      `.trim();

      layer.bindPopup(popupHtml, { closeButton: true, minWidth: 150 });

      // Handle click/tap to open popup and trigger onBoardClick
      layer.on({
        click: () => {
          if (boardCode) {
            onBoardClick(boardCode, boardName);
          }
        },
      });
    },
    [policyMap, onBoardClick]
  );

  return (
    <GeoJSON
      data={geoJsonFeatures}
      style={style}
      onEachFeature={onEachFeature}
    />
  );
}
