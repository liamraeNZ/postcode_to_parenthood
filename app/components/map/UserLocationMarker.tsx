import { CircleMarker, Tooltip } from 'react-leaflet';

export interface UserLocationMarkerProps {
  position: [number, number]; // [lat, lng]
  postcodeLabel: string;
}

/**
 * Renders a distinct circular marker at the user's GP postcode location.
 * Styled as a solid blue dot with a white border to stand out from
 * the color-coded boundary polygons.
 */
export function UserLocationMarker({ position, postcodeLabel }: UserLocationMarkerProps) {
  return (
    <CircleMarker
      center={position}
      radius={8}
      pathOptions={{
        fillColor: '#2563EB',
        fillOpacity: 1,
        color: '#FFFFFF',
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
