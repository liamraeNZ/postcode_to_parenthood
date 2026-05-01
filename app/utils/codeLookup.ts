/**
 * ONS-to-ODS code lookup utility.
 *
 * Maps ONS geography codes (e.g. "E54000064") from the ICB boundary
 * TopoJSON features to ODS codes (e.g. "09D") used as the primary key
 * in the icbs table.
 */
import onsToOds from '@/data/ons-to-ods.json';

const mapping: Record<string, string> = onsToOds;

/**
 * Returns the ODS code for a given ONS geography code, or null if not found.
 */
export function getOdsCode(onsCode: string): string | null {
  return mapping[onsCode] ?? null;
}
