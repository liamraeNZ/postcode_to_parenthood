/**
 * CARTO Positron (light, no labels) basemap URL.
 *
 * CARTO now requires a free key on basemap tiles. Without one, tiles still load
 * but are watermarked "API KEY REQUIRED". Request a key at
 * https://carto.com/basemaps/apikey and set VITE_CARTO_API_KEY in .env.local.
 * The key is public (it ships to the browser), so it is not a secret.
 */
const CARTO_API_KEY = (import.meta.env.VITE_CARTO_API_KEY as string | undefined) ?? '';

const CARTO_BASEMAP_BASE_URL = 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png';

export const CARTO_BASEMAP_URL = CARTO_API_KEY
  ? `${CARTO_BASEMAP_BASE_URL}?key=${encodeURIComponent(CARTO_API_KEY)}`
  : CARTO_BASEMAP_BASE_URL;
