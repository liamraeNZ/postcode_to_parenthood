import { CircleMarker, Tooltip } from 'react-leaflet';
import { MAP_UI } from '@/utils/theme';

export interface UserLocationMarkerProps {
  position: [number, number]; // [lat, lng]
  postcodeLabel: string;
}

/**
 * Renders a distinct circular marker at the user's GP postcode location.
 * Styled as a solid dot with a white border to stand out from
 * the color-coded boundary polygons.
 */
export function UserLocationMarker({ position, postcodeLabel }: UserLocationMarkerProps) {
  return (
    <CircleMarker
      center={position}
      radius={8}
      pathOptions={{
        fillColor: MAP_UI.userMarkerFill,
        fillOpacity: 1,
        color: MAP_UI.userMarkerStroke,
        weight: 3,
        opacity: 1,
      }}
    >
      <Tooltip direction="top" offset={[0, -8]}>
        Your GP postcode: {postcodeLabel}
      </Tooltip>
    </CircleMarker>
  );
}
