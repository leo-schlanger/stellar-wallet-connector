import { KaleRewardEstimate } from './types';

/**
 * Convert string amount to number (handles Stellar amounts)
 */
export function parseStellarAmount(amount: string): number {
  return parseFloat(amount) || 0;
}

/**
 * Format number as Stellar amount
 */
export function formatStellarAmount(amount: number): string {
  return amount.toFixed(7);
}

/**
 * Calculate optimal work parameters based on stake and gap
 */
export function calculateOptimalWork(stake: number, gap: number): {
  recommendedZeros: number;
  estimatedTime: number;
  difficulty: number;
} {
  // Simplified calculation - in reality this would be more complex
  const baseDifficulty = Math.log(stake + 1) * Math.log(gap + 1);
  const recommendedZeros = Math.max(1, Math.floor(baseDifficulty / 2));
  const estimatedTime = Math.pow(2, recommendedZeros) / 1000000; // Rough estimate
  const difficulty = Math.pow(2, recommendedZeros);

  return {
    recommendedZeros,
    estimatedTime,
    difficulty
  };
}

/**
 * Generate a simple hash for proof-of-work simulation
 */
export function generateWorkHash(
  address: string,
  nonce: number,
  ledger: number
): string {
  const data = `${address}:${nonce}:${ledger}`;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

/**
 * Simulate proof-of-work with target difficulty
 */
export function simulateProofOfWork(
  address: string,
  ledger: number,
  targetZeros: number,
  maxAttempts: number = 1000000
): { hash: string; nonce: number; zeros: number; attempts: number } {
  for (let nonce = 0; nonce < maxAttempts; nonce++) {
    const hash = generateWorkHash(address, nonce, ledger);
    const zeros = countLeadingZeros(hash);

    if (zeros >= targetZeros) {
      return { hash, nonce, zeros, attempts: nonce + 1 };
    }
  }

  throw new Error(`Could not find proof-of-work with ${targetZeros} zeros in ${maxAttempts} attempts`);
}

/**
 * Count leading zeros in a hex string
 */
export function countLeadingZeros(hash: string): number {
  let zeros = 0;
  for (let i = 0; i < hash.length; i++) {
    const char = hash[i];
    if (char === '0') {
      zeros += 4; // Each hex char represents 4 bits
    } else {
      // Count leading zeros in this hex digit
      const value = parseInt(char, 16);
      zeros += Math.clz32(value) - 28; // clz32 returns 32 for 0, we want leading zeros in 4 bits
      break;
    }
  }
  return zeros;
}

/**
 * Format time duration in human readable format
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  } else if (seconds < 3600) {
    return `${Math.round(seconds / 60)}m`;
  } else if (seconds < 86400) {
    return `${Math.round(seconds / 3600)}h`;
  } else {
    return `${Math.round(seconds / 86400)}d`;
  }
}

/**
 * Calculate expected value for a farming strategy
 */
export function calculateExpectedValue(
  stake: number,
  gap: number,
  targetZeros: number,
  attempts: number
): { expectedReward: number; expectedCost: number; profit: number } {
  const probability = 1 / Math.pow(2, targetZeros);
  const estimatedReward = stake * Math.log(gap + 1) * (targetZeros + 1) * probability;
  const expectedCost = 0.00001 * attempts; // Rough gas cost estimate

  return {
    expectedReward: estimatedReward,
    expectedCost,
    profit: estimatedReward - expectedCost
  };
}
