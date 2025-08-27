import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { KaleService } from '../kale-service';
import { StellarWalletConnector } from '@stellar-wallet-connector/core';

// Mock do Stellar SDK
vi.mock('@stellar/stellar-sdk', () => ({
  Server: vi.fn().mockImplementation(() => ({
    getAccount: vi.fn(),
    ledgers: vi.fn().mockReturnValue({
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      call: vi.fn().mockResolvedValue({
        records: [{ sequence: 1000 }]
      })
    })
  })),
  SorobanRpc: {
    Server: vi.fn().mockImplementation(() => ({
      simulateTransaction: vi.fn(),
      sendTransaction: vi.fn(),
      getTransaction: vi.fn()
    })),
    Api: {
      isSimulationError: vi.fn().mockReturnValue(false)
    },
    assembleTransaction: vi.fn()
  },
  TransactionBuilder: vi.fn().mockImplementation(() => ({
    addOperation: vi.fn().mockReturnThis(),
    setTimeout: vi.fn().mockReturnThis(),
    setSorobanData: vi.fn().mockReturnThis(),
    build: vi.fn().mockReturnValue({
      toXDR: vi.fn().mockReturnValue('mock-xdr')
    })
  })),
  Contract: vi.fn().mockImplementation(() => ({
    call: vi.fn().mockReturnThis()
  })),
  Address: vi.fn(),
  nativeToScVal: vi.fn(),
  scValToNative: vi.fn(),
  Networks: {
    PUBLIC: 'Public Global Stellar Network ; September 2015',
    TESTNET: 'Test SDF Network ; September 2015'
  }
}));

describe('KaleService', () => {
  let kaleService: KaleService;
  let mockConnector: StellarWalletConnector;

  beforeEach(() => {
    kaleService = new KaleService({ network: 'testnet' });

    // Mock connector
    mockConnector = {
      isConnected: vi.fn().mockReturnValue(true),
      getPublicKey: vi.fn().mockReturnValue('GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'),
      signTransaction: vi.fn().mockResolvedValue({
        signedXDR: 'signed-xdr',
        signerAddress: 'signer-address'
      })
    } as any;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with testnet network', () => {
      const service = new KaleService({ network: 'testnet' });
      expect(service).toBeDefined();
    });

    it('should initialize with mainnet network', () => {
      const service = new KaleService({ network: 'mainnet' });
      expect(service).toBeDefined();
    });

    it('should use default contract ID', () => {
      const service = new KaleService();
      expect(service).toBeDefined();
    });
  });

  describe('calculateGap', () => {
    it('should calculate positive gap', () => {
      const gap = kaleService.calculateGap(1000, 1100);
      expect(gap).toBe(100);
    });

    it('should handle zero gap', () => {
      const gap = kaleService.calculateGap(1000, 1000);
      expect(gap).toBe(0);
    });

    it('should handle negative gap', () => {
      const gap = kaleService.calculateGap(1100, 1000);
      expect(gap).toBe(0);
    });
  });

  describe('estimateReward', () => {
    it('should estimate reward correctly', () => {
      const estimate = kaleService.estimateReward(100, 1000, 4);

      expect(estimate).toHaveProperty('stake', 100);
      expect(estimate).toHaveProperty('gap', 1000);
      expect(estimate).toHaveProperty('zeros', 4);
      expect(estimate).toHaveProperty('estimatedReward');
      expect(estimate).toHaveProperty('probability');
      expect(estimate.probability).toBeGreaterThan(0);
      expect(estimate.probability).toBeLessThanOrEqual(0.95);
    });

    it('should handle zero values', () => {
      const estimate = kaleService.estimateReward(0, 0, 0);

      expect(estimate.stake).toBe(0);
      expect(estimate.gap).toBe(0);
      expect(estimate.zeros).toBe(0);
      expect(estimate.estimatedReward).toBe(0);
    });
  });

  describe('plant', () => {
    it('should throw error if wallet not connected', async () => {
      const disconnectedConnector = {
        ...mockConnector,
        isConnected: vi.fn().mockReturnValue(false)
      } as any;

      await expect(kaleService.plant('100', disconnectedConnector))
        .rejects.toThrow('Wallet not connected');
    });

    it('should throw error if no public key', async () => {
      const noPublicKeyConnector = {
        ...mockConnector,
        getPublicKey: vi.fn().mockReturnValue(null)
      } as any;

      await expect(kaleService.plant('100', noPublicKeyConnector))
        .rejects.toThrow('No public key available');
    });

    it('should handle plant transaction', async () => {
      const result = await kaleService.plant('100', mockConnector);

      expect(result).toHaveProperty('success');
      expect(result.success).toBe(true);
      expect(result).toHaveProperty('transactionHash');
    });
  });

  describe('work', () => {
    it('should handle work transaction', async () => {
      const result = await kaleService.work('mock-hash', mockConnector);

      expect(result).toHaveProperty('success');
      expect(result.success).toBe(true);
      expect(result).toHaveProperty('transactionHash');
    });
  });

  describe('harvest', () => {
    it('should handle harvest transaction', async () => {
      const result = await kaleService.harvest(mockConnector);

      expect(result).toHaveProperty('success');
      expect(result.success).toBe(true);
      expect(result).toHaveProperty('transactionHash');
    });
  });

  describe('getFarmStatus', () => {
    it('should return farm status', async () => {
      const status = await kaleService.getFarmStatus('mock-address');

      expect(status).toHaveProperty('isActive');
      expect(status).toHaveProperty('stakeAmount');
      expect(status).toHaveProperty('currentLedger');
      expect(status).toHaveProperty('gap');
      expect(status).toHaveProperty('pendingRewards');
    });
  });
});
