import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FreighterAdapter } from '../adapters/freighter';
import { XBullAdapter } from '../adapters/xbull';
import { AlbedoAdapter } from '../adapters/albedo';
import { RabetAdapter } from '../adapters/rabet';

describe('Wallet Adapters', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('FreighterAdapter', () => {
    let adapter: FreighterAdapter;

    beforeEach(() => {
      const mockFreighter = {
        isConnected: vi.fn().mockResolvedValue(true),
        requestAccess: vi.fn().mockResolvedValue('GDTST7THQPE6UYYBXVFHX5FDHZNGV3CAXFNQG6NHGBQB3QBHYQEKMFOG'),
        signTransaction: vi.fn().mockResolvedValue('SIGNED_XDR'),
        disconnect: vi.fn().mockResolvedValue(undefined)
      };

      Object.defineProperty(window, 'freighter', {
        value: mockFreighter,
        writable: true
      });

      adapter = new FreighterAdapter();
    });

    it('should detect when Freighter is installed', () => {
      expect(adapter.isInstalled()).toBe(true);
      expect(adapter.walletInfo.installed).toBe(true);
    });

    it('should have correct wallet info', () => {
      expect(adapter.walletInfo.id).toBe('freighter');
      expect(adapter.walletInfo.name).toBe('Freighter');
      expect(adapter.walletInfo.website).toBe('https://freighter.app');
    });

    it('should connect successfully', async () => {
      const result = await adapter.connect();
      expect(result.publicKey).toBe('GDTST7THQPE6UYYBXVFHX5FDHZNGV3CAXFNQG6NHGBQB3QBHYQEKMFOG');
      expect(result.wallet.id).toBe('freighter');
    });

    it('should sign transactions', async () => {
      await adapter.connect();
      const result = await adapter.signTransaction('TEST_XDR');
      expect(result.signedXDR).toBe('SIGNED_XDR');
    });
  });

  describe('XBullAdapter', () => {
    let adapter: XBullAdapter;

    beforeEach(() => {
      const mockXBull = {
        connect: vi.fn().mockResolvedValue({ address: 'GDTST7THQPE6UYYBXVFHX5FDHZNGV3CAXFNQG6NHGBQB3QBHYQEKMFOG' }),
        sign: vi.fn().mockResolvedValue({ signedXDR: 'SIGNED_XDR' }),
        disconnect: vi.fn().mockResolvedValue(undefined),
        isConnected: vi.fn().mockResolvedValue(true)
      };

      Object.defineProperty(window, 'xBullWalletConnect', {
        value: mockXBull,
        writable: true
      });

      adapter = new XBullAdapter();
    });

    it('should detect when xBull is installed', () => {
      expect(adapter.isInstalled()).toBe(true);
    });

    it('should have correct wallet info', () => {
      expect(adapter.walletInfo.id).toBe('xbull');
      expect(adapter.walletInfo.name).toBe('xBull');
    });
  });

  describe('AlbedoAdapter', () => {
    let adapter: AlbedoAdapter;

    beforeEach(() => {
      const mockAlbedo = {
        publicKey: vi.fn().mockResolvedValue({ pubkey: 'GDTST7THQPE6UYYBXVFHX5FDHZNGV3CAXFNQG6NHGBQB3QBHYQEKMFOG' }),
        tx: vi.fn().mockResolvedValue({ signed_envelope_xdr: 'SIGNED_XDR', tx_signature: 'SIGNATURE' })
      };

      Object.defineProperty(window, 'albedo', {
        value: mockAlbedo,
        writable: true
      });

      adapter = new AlbedoAdapter();
    });

    it('should detect when Albedo is installed', () => {
      expect(adapter.isInstalled()).toBe(true);
    });

    it('should have correct wallet info', () => {
      expect(adapter.walletInfo.id).toBe('albedo');
      expect(adapter.walletInfo.name).toBe('Albedo');
    });
  });

  describe('RabetAdapter', () => {
    let adapter: RabetAdapter;

    beforeEach(() => {
      const mockRabet = {
        connect: vi.fn().mockResolvedValue({ address: 'GDTST7THQPE6UYYBXVFHX5FDHZNGV3CAXFNQG6NHGBQB3QBHYQEKMFOG' }),
        sign: vi.fn().mockResolvedValue({ xdr: 'SIGNED_XDR' }),
        disconnect: vi.fn().mockResolvedValue(undefined),
        isConnected: vi.fn().mockResolvedValue(true)
      };

      Object.defineProperty(window, 'rabet', {
        value: mockRabet,
        writable: true
      });

      adapter = new RabetAdapter();
    });

    it('should detect when Rabet is installed', () => {
      expect(adapter.isInstalled()).toBe(true);
    });

    it('should have correct wallet info', () => {
      expect(adapter.walletInfo.id).toBe('rabet');
      expect(adapter.walletInfo.name).toBe('Rabet');
    });
  });

  describe('Base adapter error handling', () => {
    it('should throw error when wallet is not installed', () => {
      // Clear the window object to simulate wallet not installed
      Object.defineProperty(window, 'freighter', {
        value: undefined,
        writable: true
      });

      const adapter = new FreighterAdapter();
      expect(() => adapter.checkInstallation()).toThrow('Freighter is not installed');
    });
  });
});
