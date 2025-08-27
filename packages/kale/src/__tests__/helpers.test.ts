import { describe, it, expect } from 'vitest';
import {
  parseStellarAmount,
  formatStellarAmount,
  calculateOptimalWork,
  simulateProofOfWork,
  countLeadingZeros,
  formatDuration,
  calculateExpectedValue
} from '../helpers';

describe('Helpers', () => {
  describe('parseStellarAmount', () => {
    it('should parse valid string amount', () => {
      expect(parseStellarAmount('100.1234567')).toBe(100.1234567);
    });

    it('should handle empty string', () => {
      expect(parseStellarAmount('')).toBe(0);
    });

    it('should handle invalid string', () => {
      expect(parseStellarAmount('invalid')).toBe(0);
    });
  });

  describe('formatStellarAmount', () => {
    it('should format number with 7 decimal places', () => {
      expect(formatStellarAmount(100.123456789)).toBe('100.1234568');
    });

    it('should handle zero', () => {
      expect(formatStellarAmount(0)).toBe('0.0000000');
    });
  });

  describe('countLeadingZeros', () => {
    it('should count leading zeros correctly', () => {
      expect(countLeadingZeros('00001234')).toBe(4);
    });

    it('should handle no leading zeros', () => {
      expect(countLeadingZeros('12340000')).toBe(0);
    });

    it('should handle all zeros', () => {
      expect(countLeadingZeros('00000000')).toBe(8);
    });

    it('should handle empty string', () => {
      expect(countLeadingZeros('')).toBe(0);
    });
  });

  describe('calculateOptimalWork', () => {
    it('should calculate optimal work parameters', () => {
      const result = calculateOptimalWork(100, 1000);

      expect(result).toHaveProperty('recommendedZeros');
      expect(result).toHaveProperty('estimatedTime');
      expect(result).toHaveProperty('difficulty');
      expect(result.recommendedZeros).toBeGreaterThan(0);
      expect(result.estimatedTime).toBeGreaterThan(0);
      expect(result.difficulty).toBeGreaterThan(0);
    });

    it('should handle zero stake', () => {
      const result = calculateOptimalWork(0, 1000);

      expect(result.recommendedZeros).toBe(1);
    });

    it('should handle zero gap', () => {
      const result = calculateOptimalWork(100, 0);

      expect(result.recommendedZeros).toBe(1);
    });
  });

  describe('simulateProofOfWork', () => {
    it('should simulate proof of work', () => {
      const result = simulateProofOfWork('mock-address', 1000, 2, 100);

      expect(result).toHaveProperty('hash');
      expect(result).toHaveProperty('nonce');
      expect(result).toHaveProperty('zeros');
      expect(result).toHaveProperty('attempts');
      expect(result.zeros).toBeGreaterThanOrEqual(2);
    });

    it('should throw error if max attempts reached', () => {
      expect(() => {
        simulateProofOfWork('mock-address', 1000, 10, 10);
      }).toThrow('Could not find proof-of-work');
    });
  });

  describe('formatDuration', () => {
    it('should format seconds', () => {
      expect(formatDuration(30)).toBe('30s');
    });

    it('should format minutes', () => {
      expect(formatDuration(90)).toBe('2m');
    });

    it('should format hours', () => {
      expect(formatDuration(7200)).toBe('2h');
    });

    it('should format days', () => {
      expect(formatDuration(172800)).toBe('2d');
    });
  });

  describe('calculateExpectedValue', () => {
    it('should calculate expected value', () => {
      const result = calculateExpectedValue(100, 1000, 4, 100000);

      expect(result).toHaveProperty('expectedReward');
      expect(result).toHaveProperty('expectedCost');
      expect(result).toHaveProperty('profit');
      expect(result.expectedReward).toBeGreaterThan(0);
      expect(result.expectedCost).toBeGreaterThan(0);
    });

    it('should handle zero attempts', () => {
      const result = calculateExpectedValue(100, 1000, 4, 0);

      expect(result.expectedCost).toBe(0);
      expect(result.profit).toBe(result.expectedReward);
    });
  });
});
