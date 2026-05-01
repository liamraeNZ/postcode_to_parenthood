export function normalizePostcode(input: string) {
  return input.trim().toUpperCase().replace(/\s+/g, '');
}

export function normalizeUpperTrim(input: string) {
  return input.trim().toUpperCase();
}

export function redactPostcodeForLogs(normalizedPostcode: string) {
  if (!normalizedPostcode) return '';
  const visible = normalizedPostcode.slice(0, Math.min(3, normalizedPostcode.length));
  return `${visible}${'*'.repeat(Math.max(0, normalizedPostcode.length - visible.length))}`;
}
