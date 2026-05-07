/**
 * ONS-to-board-code lookup utility.
 *
 * Maps ONS geography codes (e.g. "E54000064", "S08000015", "W11000025", "N09000003")
 * from care board boundary TopoJSON features to board codes used as the primary key
 * in the health_boards table.
 *
 * For England, the board code is an ODS code (e.g. "09D").
 * For Scotland, Wales, and NI, the ONS code IS the board ID.
 */
import onsToBoardCode from '@/data/ons-to-board-code.json';

const mapping: Record<string, string> = onsToBoardCode;

/**
 * Returns the board code for a given ONS geography code, or null if not found.
 */
export function getBoardCode(onsCode: string): string | null {
  return mapping[onsCode] ?? null;
}
