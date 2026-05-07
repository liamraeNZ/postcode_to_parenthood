/**
 * Generates an accessible ARIA label for a health board polygon on the choropleth map.
 *
 * The label conveys both the health board name and the number of cycles offered,
 * or "no data available" when the value is null.
 *
 * Examples:
 *   ("NHS West Yorkshire", 3) → "NHS West Yorkshire, 3 cycles offered"
 *   ("NHS Devon", 0)          → "NHS Devon, 0 cycles offered"
 *   ("NHS Cornwall", null)    → "NHS Cornwall, no data available"
 */
export function getBoardAriaLabel(boardName: string, cyclesOffered: number | null): string {
  if (cyclesOffered === null) {
    return `${boardName}, no data available`;
  }
  return `${boardName}, ${cyclesOffered} cycles offered`;
}

/**
 * @deprecated Use getBoardAriaLabel instead
 */
export const getIcbAriaLabel = getBoardAriaLabel;
