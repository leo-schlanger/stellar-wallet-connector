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

  describe('Adapter Connection States', () => {
    it('should track connection state correctly', async () => {
      const adapter = new FreighterAdapter();

      // Initially not connected
      expect(adapter.isConnected()).toBe(false);
      expect(adapter.getPublicKey()).toBe(null);

      // After connecting
      await adapter.connect();
      expect(adapter.isConnected()).toBe(true);
      expect(adapter.getPublicKey()).toBeDefined();

      // After disconnecting
      await adapter.disconnect();
      expect(adapter.isConnected()).toBe(false);
      expect(adapter.getPublicKey()).toBe(null);
    });
  });

  describe('Transaction Signing', () => {
    it('should sign transactions with options', async () => {
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

      const adapter = new FreighterAdapter();
      await adapter.connect();

      const options = {
        networkPassphrase: 'Test SDF Network ; September 2015',
        accountToSign: 'GDTST7THQPE6UYYBXVFHX5FDHZNGV3CAXFNQG6NHGBQB3QBHYQEKMFOG'
      };

      await adapter.signTransaction('TEST_XDR', options);

      expect(mockFreighter.signTransaction).toHaveBeenCalledWith('TEST_XDR', options);
    });

    it('should handle signAuthEntry delegation', async () => {
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

      const adapter = new FreighterAdapter();
      await adapter.connect();

      const result = await adapter.signAuthEntry('AUTH_ENTRY_XDR');

      expect(mockFreighter.signTransaction).toHaveBeenCalledWith('AUTH_ENTRY_XDR', undefined);
      expect(result.signedXDR).toBe('SIGNED_XDR');
    });
  });

  describe('Error Scenarios', () => {
    it('should handle connection rejection', async () => {
      const mockFreighter = {
        isConnected: vi.fn().mockResolvedValue(false),
        requestAccess: vi.fn().mockRejectedValue(new Error('User denied access')),
        signTransaction: vi.fn().mockResolvedValue('SIGNED_XDR'),
        disconnect: vi.fn().mockResolvedValue(undefined)
      };

      Object.defineProperty(window, 'freighter', {
        value: mockFreighter,
        writable: true
      });

      const adapter = new FreighterAdapter();

      await expect(adapter.connect()).rejects.toThrow('User denied access');
      expect(adapter.isConnected()).toBe(false);
    });

    it('should handle signing errors', async () => {
      const mockFreighter = {
        isConnected: vi.fn().mockResolvedValue(true),
        requestAccess: vi.fn().mockResolvedValue('GDTST7THQPE6UYYBXVFHX5FDHZNGV3CAXFNQG6NHGBQB3QBHYQEKMFOG'),
        signTransaction: vi.fn().mockRejectedValue(new Error('Signing failed')),
        disconnect: vi.fn().mockResolvedValue(undefined)
      };

      Object.defineProperty(window, 'freighter', {
        value: mockFreighter,
        writable: true
      });

      const adapter = new FreighterAdapter();
      await adapter.connect();

      await expect(adapter.signTransaction('TEST_XDR')).rejects.toThrow('Signing failed');
    });
  });

  describe('Wallet Detection', () => {
    it('should correctly detect installed wallets', () => {
      // Test Freighter
      expect(new FreighterAdapter().isInstalled()).toBe(true);

      // Test xBull
      expect(new XBullAdapter().isInstalled()).toBe(true);

      // Test Albedo
      expect(new AlbedoAdapter().isInstalled()).toBe(true);

      // Test Rabet
      expect(new RabetAdapter().isInstalled()).toBe(true);
    });

    it('should handle missing wallet installations', () => {
      // Temporarily remove window properties
      const originalFreighter = window.freighter;
      const originalXBull = window.xBullWalletConnect;
      const originalAlbedo = window.albedo;
      const originalRabet = window.rabet;

      delete window.freighter;
      delete window.xBullWalletConnect;
      delete window.albedo;
      delete window.rabet;

      expect(new FreighterAdapter().isInstalled()).toBe(false);
      expect(new XBullAdapter().isInstalled()).toBe(false);
      expect(new AlbedoAdapter().isInstalled()).toBe(false);
      expect(new RabetAdapter().isInstalled()).toBe(false);

      // Restore
      window.freighter = originalFreighter;
      window.xBullWalletConnect = originalXBull;
      window.albedo = originalAlbedo;
      window.rabet = originalRabet;
    });
  });
});
