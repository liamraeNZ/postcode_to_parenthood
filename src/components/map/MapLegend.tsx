import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

const LEGEND_ITEMS = [
  { color: '#34D399', label: '3+ cycles' },
  { color: '#FBBF24', label: '2 cycles' },
  { color: '#FB923C', label: '1 cycle' },
  { color: '#F87171', label: '0 cycles' },
  { color: '#D1D5DB', label: 'No data' },
] as const;

/**
 * MapLegend renders a Leaflet control in the bottom-right corner of the map
 * showing the 4 colour categories used to code ICB polygons.
 */
export function MapLegend() {
  const map = useMap();
  const controlRef = useRef<L.Control | null>(null);

  useEffect(() => {
    const LegendControl = L.Control.extend({
      options: { position: 'bottomright' as L.ControlPosition },

      onAdd() {
        const container = L.DomUtil.create('div', 'map-legend');
        container.style.backgroundColor = 'white';
        container.style.borderRadius = '8px';
        container.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.06)';
        container.style.padding = '12px 14px';
        container.style.lineHeight = '1.6';
        container.style.fontSize = '13px';
        container.style.color = '#374151';

        const title = L.DomUtil.create('div', '', container);
        title.style.fontWeight = '600';
        title.style.marginBottom = '6px';
        title.style.fontSize = '13px';
        title.textContent = 'Cycles offered';

        for (const item of LEGEND_ITEMS) {
          const row = L.DomUtil.create('div', '', container);
          row.style.display = 'flex';
          row.style.alignItems = 'center';
          row.style.gap = '8px';
          row.style.marginBottom = '2px';

          const swatch = L.DomUtil.create('span', '', row);
          swatch.style.display = 'inline-block';
          swatch.style.width = '16px';
          swatch.style.height = '16px';
          swatch.style.borderRadius = '3px';
          swatch.style.backgroundColor = item.color;
          swatch.style.border = '1px solid rgba(0, 0, 0, 0.1)';
          swatch.style.flexShrink = '0';

          const label = L.DomUtil.create('span', '', row);
          label.textContent = item.label;
        }

        // Prevent map interactions when clicking/scrolling on the legend
        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableScrollPropagation(container);

        return container;
      },
    });

    const legend = new LegendControl();
    legend.addTo(map);
    controlRef.current = legend;

    return () => {
      if (controlRef.current) {
        controlRef.current.remove();
      }
    };
  }, [map]);

  return null;
}
