import { describe, it, expect } from 'vitest';
import { isVirtualGpPractice } from '../worker/lib/virtualGps';

describe('isVirtualGpPractice', () => {
  describe('ODS code allowlist (primary detection)', () => {
    it('returns true for GP at Hand ODS code E85124', () => {
      expect(isVirtualGpPractice('E85124', 'Lillie Road Surgery')).toBe(true);
    });

    it('returns true for known ODS code regardless of practice name', () => {
      expect(isVirtualGpPractice('E85124', 'Some Random Name')).toBe(true);
    });

    it('returns false for unknown ODS codes with non-matching names', () => {
      expect(isVirtualGpPractice('A12345', 'Elm Tree Surgery')).toBe(false);
    });
  });

  describe('name-pattern heuristics (secondary detection)', () => {
    it('detects "GP AT HAND" in practice name', () => {
      expect(isVirtualGpPractice('X99999', 'GP at Hand - London')).toBe(true);
    });

    it('detects "EMED" in practice name', () => {
      expect(isVirtualGpPractice('X99999', 'eMed Digital Practice')).toBe(true);
    });

    it('detects "DIGITAL FIRST" in practice name', () => {
      expect(isVirtualGpPractice('X99999', 'Digital First Primary Care')).toBe(true);
    });

    it('is case-insensitive for name matching', () => {
      expect(isVirtualGpPractice('X99999', 'gp at hand clinic')).toBe(true);
      expect(isVirtualGpPractice('X99999', 'EMED HEALTHCARE')).toBe(true);
      expect(isVirtualGpPractice('X99999', 'digital first surgery')).toBe(true);
    });

    it('returns false for names that do not match any pattern', () => {
      expect(isVirtualGpPractice('X99999', 'Oakwood Medical Centre')).toBe(false);
      expect(isVirtualGpPractice('X99999', 'The Village Surgery')).toBe(false);
    });
  });
});
