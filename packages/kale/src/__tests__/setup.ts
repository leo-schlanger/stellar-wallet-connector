import '@testing-library/jest-dom';

import { vi } from 'vitest';

// Mock do StellarWalletConnector
vi.mock('@stellar-wallet-connector/core', () => ({
  StellarWalletConnector: vi.fn().mockImplementation(() => ({
    isConnected: vi.fn(),
    getPublicKey: vi.fn(),
    getCurrentWallet: vi.fn(),
    signTransaction: vi.fn()
  }))
}));

// Mock do KaleService
vi.mock('../kale-service', () => ({
  KaleService: vi.fn().mockImplementation(() => ({
    plant: vi.fn(),
    work: vi.fn(),
    harvest: vi.fn(),
    getFarmStatus: vi.fn(),
    estimateReward: vi.fn(),
    calculateGap: vi.fn()
  }))
}));

// Mock do helpers
vi.mock('../helpers', () => ({
  countLeadingZeros: vi.fn(),
  simulateProofOfWork: vi.fn(),
  calculateOptimalWork: vi.fn(),
  calculateExpectedValue: vi.fn()
}));
