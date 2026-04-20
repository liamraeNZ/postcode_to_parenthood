import { ICBPolicy } from '../types';

function normalizePostcode(input: string) {
  return input.trim().toUpperCase().replace(/\s+/g, '');
}

export async function lookupICBByPostcode(postcode: string): Promise<ICBPolicy | null> {
  const normalized = normalizePostcode(postcode);
  if (!normalized) return null;

  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';

  const response = await fetch(
    `${apiBaseUrl}/api/icb-policy?postcode=${encodeURIComponent(normalized)}`
  );

  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Postcode lookup failed: ${response.status}`);

  return (await response.json()) as ICBPolicy;
}
