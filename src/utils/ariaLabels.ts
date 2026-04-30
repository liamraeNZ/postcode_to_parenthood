/**
 * Generates an accessible ARIA label for an ICB polygon on the choropleth map.
 *
 * The label conveys both the ICB name and the number of cycles offered,
 * or "no data available" when the value is null.
 *
 * Examples:
 *   ("NHS West Yorkshire", 3) → "NHS West Yorkshire, 3 cycles offered"
 *   ("NHS Devon", 0)          → "NHS Devon, 0 cycles offered"
 *   ("NHS Cornwall", null)    → "NHS Cornwall, no data available"
 */
export function getIcbAriaLabel(icbName: string, cyclesOffered: number | null): string {
  if (cyclesOffered === null) {
    return `${icbName}, no data available`;
  }
  return `${icbName}, ${cyclesOffered} cycles offered`;
}
