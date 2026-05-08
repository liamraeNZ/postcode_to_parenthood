import { useEffect, useState } from 'react';

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  country: string;
}

export interface UseGeocodePostcodeReturn {
  data: GeocodeResult | null;
  loading: boolean;
  error: boolean;
}

/**
 * Hook that geocodes a postcode via the /api/geocode-postcode endpoint.
 * Returns coordinates and country on success, or null data with error flag on failure.
 * Skips the fetch entirely if postcode is null or empty.
 * Enforces a 3-second timeout via AbortController.
 */
export function useGeocodePostcode(postcode: string | null): UseGeocodePostcodeReturn {
  const [data, setData] = useState<GeocodeResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (!postcode || postcode.trim() === '') {
      setData(null);
      setLoading(false);
      setError(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    let cancelled = false;

    async function fetchGeocode() {
      setLoading(true);
      setError(false);
      setData(null);

      try {
        const res = await fetch(
          `/api/geocode-postcode?postcode=${encodeURIComponent(postcode!)}`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          if (!cancelled) {
            setData(null);
            setError(true);
          }
          return;
        }

        const json: { latitude: number; longitude: number; country: string } = await res.json();

        if (!cancelled) {
          setData({
            latitude: json.latitude,
            longitude: json.longitude,
            country: json.country,
          });
          setError(false);
        }
      } catch {
        if (!cancelled) {
          setData(null);
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchGeocode();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [postcode]);

  return { data, loading, error };
}
