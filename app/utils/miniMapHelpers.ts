import L from 'leaflet';
import type { Feature, FeatureCollection, GeoJsonProperties } from 'geojson';
import { getBoardCode } from '@/utils/codeLookup';
import type { MapPolicyEntry } from '@/components/map/IcbBoundaryLayer';
import type { VisibleBoard } from '@/components/map/MiniMapBoundaryLayer';

/**
 * Determines whether a neighbouring board represents an improvement over the
 * user's current board based on IVF cycles offered.
 *
 * Returns true if neighbourCycles is non-null AND greater than (currentCycles ?? 0).
 */
export function isImprovementBoard(
  currentCycles: number | null,
  neighbourCycles: number | null
): boolean {
  if (neighbourCycles === null) return false;
  return neighbourCycles > (currentCycles ?? 0);
}

/**
 * Extracts the ONS code from a GeoJSON feature's properties.
 */
function getOnsCode(properties: GeoJsonProperties): string {
  if (!properties) return '';
  return properties.icb23cd ?? properties.ICB23CD ?? properties.board_cd ?? '';
}

/**
 * Returns the list of boards whose bounding boxes intersect the given map bounds,
 * excluding the user's current board.
 *
 * @param mapBounds - A Leaflet LatLngBounds object representing the current viewport
 * @param features - The GeoJSON FeatureCollection of health board boundaries
 * @param policyMap - Map of board IDs to their policy entries
 * @param currentBoardId - The user's current board ID to exclude from results
 */
export function getVisibleBoards(
  mapBounds: L.LatLngBounds,
  features: FeatureCollection,
  policyMap: Map<string, MapPolicyEntry[]>,
  currentBoardId: string
): VisibleBoard[] {
  const visible: VisibleBoard[] = [];

  for (const feature of features.features) {
    const props = feature.properties;
    const onsCode = getOnsCode(props);
    const boardCode = getBoardCode(onsCode);
    if (!boardCode) continue;

    // Exclude the user's current board
    if (boardCode === currentBoardId) continue;

    // Check if feature bounding box intersects the map viewport
    const featureLayer = L.geoJSON(feature as Feature);
    const featureBounds = featureLayer.getBounds();
    if (!mapBounds.intersects(featureBounds)) continue;

    // Look up policy data for IVF treatment type
    const entries = policyMap.get(boardCode);
    const ivfEntry = entries?.find((e) => e.treatment_type_id === 'ivf') ?? null;

    visible.push({
      boardId: boardCode,
      boardName: ivfEntry?.board_name ?? props?.icb23nm ?? props?.ICB23NM ?? props?.board_nm ?? 'Unknown',
      cyclesOffered: ivfEntry?.cycles_offered ?? null,
      documentFolderName: ivfEntry?.document_folder_name ?? null,
    });
  }

  return visible;
}
