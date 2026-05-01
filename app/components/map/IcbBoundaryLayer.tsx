import { useCallback, useRef } from 'react';
import { GeoJSON } from 'react-leaflet';
import type { Layer, PathOptions, LeafletEvent } from 'leaflet';
import type { Feature, GeoJsonProperties } from 'geojson';
import type { TreatmentTypeId } from './TreatmentToggle';
import { getMapFillColor } from '@/utils/mapColors';
import { getOdsCode } from '@/utils/codeLookup';
import { getIcbAriaLabel } from '@/utils/ariaLabels';

export interface MapPolicyEntry {
  icb_id: string;
  icb_name: string;
  document_folder_name: string | null;
  treatment_type_id: string;
  cycles_offered: number;
  min_age: number | null;
  max_age: number;
}

export interface IcbBoundaryLayerProps {
  geoJsonFeatures: GeoJSON.FeatureCollection;
  policyMap: Map<string, MapPolicyEntry[]>;
  selectedTreatment: TreatmentTypeId;
  onIcbHover: (icbId: string | null) => void;
  onIcbClick: (icbId: string) => void;
}

const DEFAULT_BORDER: PathOptions = {
  weight: 1,
  color: '#6B7280',
  opacity: 0.7,
  fillOpacity: 0.7,
};

const HOVER_BORDER: PathOptions = {
  weight: 3,
  color: '#1F2937',
};

function getPolicyEntry(
  policyMap: Map<string, MapPolicyEntry[]>,
  onsCode: string,
  selectedTreatment: TreatmentTypeId
): MapPolicyEntry | null {
  const odsCode = getOdsCode(onsCode);
  if (!odsCode) return null;

  const entries = policyMap.get(odsCode);
  if (!entries) return null;

  return entries.find((e) => e.treatment_type_id === selectedTreatment) ?? null;
}

export function IcbBoundaryLayer({
  geoJsonFeatures,
  policyMap,
  selectedTreatment,
  onIcbHover,
  onIcbClick,
}: IcbBoundaryLayerProps) {
  const hoveredLayerRef = useRef<Layer | null>(null);

  const style = useCallback(
    (feature: Feature<GeoJSON.Geometry, GeoJsonProperties> | undefined): PathOptions => {
      if (!feature?.properties) {
        return { ...DEFAULT_BORDER, fillColor: getMapFillColor(null) };
      }

      const onsCode: string = feature.properties.icb23cd ?? feature.properties.ICB23CD ?? '';
      const entry = getPolicyEntry(policyMap, onsCode, selectedTreatment);
      const cycles = entry ? entry.cycles_offered : null;

      return {
        ...DEFAULT_BORDER,
        fillColor: getMapFillColor(cycles),
      };
    },
    [policyMap, selectedTreatment]
  );

  const onEachFeature = useCallback(
    (feature: Feature<GeoJSON.Geometry, GeoJsonProperties>, layer: Layer) => {
      const props = feature.properties;
      if (!props) return;

      const onsCode: string = props.icb23cd ?? props.ICB23CD ?? '';
      const icbName: string = props.icb23nm ?? props.ICB23NM ?? 'Unknown ICB';
      const odsCode = getOdsCode(onsCode);
      const entry = getPolicyEntry(policyMap, onsCode, selectedTreatment);
      const cycles = entry ? entry.cycles_offered : null;

      // Apply ARIA attributes, keyboard navigation, and touch support to the polygon element
      const ariaLabel = getIcbAriaLabel(icbName, cycles);

      const applyInteractivity = (el: HTMLElement) => {
        el.setAttribute('aria-label', ariaLabel);
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');

        // Keyboard navigation: Enter/Space triggers click
        el.addEventListener('keydown', (e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (odsCode) onIcbClick(odsCode);
          }
        });

        // Touch device support
        el.addEventListener('touchstart', () => {
          layer.openTooltip();
        }, { passive: true });
      };

      // Try to apply immediately if element exists
      const layerEl = (layer as unknown as { getElement?: () => HTMLElement }).getElement?.();
      if (layerEl) {
        applyInteractivity(layerEl);
      } else {
        // Element may not exist yet; apply when layer is added to the map
        layer.on('add', () => {
          const addedEl = (layer as unknown as { getElement?: () => HTMLElement }).getElement?.();
          if (addedEl) {
            applyInteractivity(addedEl);
          }
        });
      }

      layer.on({
        mouseover: (e: LeafletEvent) => {
          const target = e.target as Layer & { setStyle: (s: PathOptions) => void };
          target.setStyle(HOVER_BORDER);
          hoveredLayerRef.current = target;
          if (odsCode) onIcbHover(odsCode);
        },
        mouseout: (e: LeafletEvent) => {
          const target = e.target as Layer & { setStyle: (s: PathOptions) => void };
          target.setStyle({
            weight: DEFAULT_BORDER.weight,
            color: DEFAULT_BORDER.color,
            opacity: DEFAULT_BORDER.opacity,
          });
          hoveredLayerRef.current = null;
          onIcbHover(null);
        },
        click: () => {
          if (odsCode) onIcbClick(odsCode);
        },
      });

      // Bind tooltip with ICB name and cycles info
      const tooltipContent = cycles !== null
        ? `${icbName}: ${cycles} cycle${cycles !== 1 ? 's' : ''} offered`
        : `${icbName}: No data`;
      layer.bindTooltip(tooltipContent, { sticky: true, direction: 'top' });
    },
    [policyMap, selectedTreatment, onIcbHover, onIcbClick]
  );

  return (
    <GeoJSON
      key={selectedTreatment}
      data={geoJsonFeatures}
      style={style}
      onEachFeature={onEachFeature}
    />
  );
}
