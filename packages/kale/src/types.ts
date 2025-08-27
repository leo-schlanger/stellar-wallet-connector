export interface KaleFarmStatus {
  isActive: boolean;
  stakeAmount: string;
  plantLedger: number;
  currentLedger: number;
  gap: number;
  pendingRewards: string;
  lastWorkHash?: string;
  lastWorkLedger?: number;
}

export interface KaleRewardEstimate {
  stake: number;
  gap: number;
  zeros: number;
  estimatedReward: number;
  probability: number;
}

export interface KaleLeaderboardEntry {
  address: string;
  totalRewards: string;
  totalStake: string;
  lastHarvest: number;
  rank: number;
}

export interface KaleFarmOptions {
  contractId?: string;
  network?: 'testnet' | 'mainnet';
}

export interface KaleTransactionResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}
