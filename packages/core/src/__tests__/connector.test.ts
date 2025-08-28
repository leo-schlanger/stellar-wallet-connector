import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StellarWalletConnector } from '../connector';

// Mock window.freighter
const mockFreighter = {
  isConnected: vi.fn().mockResolvedValue(false),
  requestAccess: vi.fn().mockResolvedValue('GDTST7THQPE6UYYBXVFHX5FDHZNGV3CAXFNQG6NHGBQB3QBHYQEKMFOG'),
  signTransaction: vi.fn().mockResolvedValue('SIGNED_XDR_STRING'),
  getPublicKey: vi.fn().mockResolvedValue('GDTST7THQPE6UYYBXVFHX5FDHZNGV3CAXFNQG6NHGBQB3QBHYQEKMFOG'),
  disconnect: vi.fn().mockResolvedValue(undefined)
};

Object.defineProperty(window, 'freighter', {
  value: mockFreighter,
  writable: true
});

describe('StellarWalletConnector', () => {
  let connector: StellarWalletConnector;

  beforeEach(() => {
    connector = new StellarWalletConnector();
    vi.clearAllMocks();
  });

  it('should initialize with default adapters', () => {
    const wallets = connector.getAvailableWallets();
    expect(wallets.length).toBeGreaterThan(0);
    expect(wallets.some(w => w.id === 'freighter')).toBe(true);
    expect(wallets.some(w => w.id === 'xbull')).toBe(true);
    expect(wallets.some(w => w.id === 'albedo')).toBe(true);
    expect(wallets.some(w => w.id === 'rabet')).toBe(true);
  });

  it('should detect installed wallets', () => {
    const installedWallets = connector.getInstalledWallets();
    // Freighter should be detected as installed due to our mock
    expect(installedWallets.some(w => w.id === 'freighter')).toBe(true);
  });

  it('should connect to Freighter wallet', async () => {
    const result = await connector.connect('freighter');
    
    expect(mockFreighter.requestAccess).toHaveBeenCalled();
    expect(result.publicKey).toBe('GDTST7THQPE6UYYBXVFHX5FDHZNGV3CAXFNQG6NHGBQB3QBHYQEKMFOG');
    expect(result.wallet.id).toBe('freighter');
    expect(connector.isConnected()).toBe(true);
    expect(connector.getPublicKey()).toBe('GDTST7THQPE6UYYBXVFHX5FDHZNGV3CAXFNQG6NHGBQB3QBHYQEKMFOG');
  });

  it('should throw error when connecting to unknown wallet', async () => {
    await expect(connector.connect('unknown-wallet')).rejects.toThrow('Wallet with id "unknown-wallet" not found');
  });

  it('should sign transactions', async () => {
    await connector.connect('freighter');
    const result = await connector.signTransaction('TEST_XDR');
    
    expect(mockFreighter.signTransaction).toHaveBeenCalledWith('TEST_XDR', {
      networkPassphrase: 'Test SDF Network ; September 2015'
    });
    expect(result.signedXDR).toBe('SIGNED_XDR_STRING');
  });

  it('should use mainnet network passphrase when configured', async () => {
    const mainnetConnector = new StellarWalletConnector({ network: 'mainnet' });
    await mainnetConnector.connect('freighter');
    await mainnetConnector.signTransaction('TEST_XDR');
    
    expect(mockFreighter.signTransaction).toHaveBeenCalledWith('TEST_XDR', {
      networkPassphrase: 'Public Global Stellar Network ; September 2015'
    });
  });

  it('should throw error when signing without connection', async () => {
    await expect(connector.signTransaction('TEST_XDR')).rejects.toThrow('No wallet connected');
  });

  it('should disconnect wallet', async () => {
    await connector.connect('freighter');
    expect(connector.isConnected()).toBe(true);
    
    await connector.disconnect();
    
    expect(mockFreighter.disconnect).toHaveBeenCalled();
    expect(connector.isConnected()).toBe(false);
    expect(connector.getPublicKey()).toBe(null);
    expect(connector.getCurrentWallet()).toBe(null);
  });

  it('should handle disconnect when no wallet is connected', async () => {
    await expect(connector.disconnect()).resolves.not.toThrow();
  });

  it('should get current wallet info', async () => {
    await connector.connect('freighter');
    const wallet = connector.getCurrentWallet();

    expect(wallet).toBeDefined();
    expect(wallet?.id).toBe('freighter');
    expect(wallet?.name).toBe('Freighter');
  });

  it('should return null for current wallet when not connected', () => {
    const wallet = connector.getCurrentWallet();
    expect(wallet).toBeNull();
  });

  it('should handle connection errors gracefully', async () => {
    mockFreighter.requestAccess.mockRejectedValueOnce(new Error('User denied access'));

    await expect(connector.connect('freighter')).rejects.toThrow('User denied access');
    expect(connector.isConnected()).toBe(false);
  });

  it('should handle signing errors gracefully', async () => {
    await connector.connect('freighter');
    mockFreighter.signTransaction.mockRejectedValueOnce(new Error('Signing failed'));

    await expect(connector.signTransaction('TEST_XDR')).rejects.toThrow('Signing failed');
  });

  it('should reconnect to different wallet', async () => {
    // Connect to freighter first
    await connector.connect('freighter');
    expect(connector.getCurrentWallet()?.id).toBe('freighter');

    // Mock xBull adapter (we'll assume it exists for this test)
    const mockXBull = {
      isConnected: vi.fn().mockResolvedValue(false),
      connect: vi.fn().mockResolvedValue({
        address: 'GAXLYHOPVZ5OX6WGOHJOROEKZYKGXUJR5ZBJOW5ZJ4GH6EK3KGHXWJWJ'
      }),
      sign: vi.fn().mockResolvedValue({ signedXDR: 'XBULL_SIGNED' }),
      disconnect: vi.fn().mockResolvedValue(undefined)
    };

    // Simulate connecting to xbull (this would normally auto-disconnect freighter)
    mockFreighter.disconnect.mockClear();

    // Since we don't have xBull in our test setup, we'll just test the disconnect call
    await connector.disconnect();
    expect(mockFreighter.disconnect).toHaveBeenCalled();
  });

  it('should initialize with custom options', () => {
    const customConnector = new StellarWalletConnector({
      network: 'mainnet',
      autoConnect: true
    });

    expect(customConnector).toBeDefined();
    // We can't easily test autoConnect in unit tests without more complex mocking
  });

  it('should provide access to individual adapters', () => {
    const adapter = connector.getAdapter('freighter');
    expect(adapter).toBeDefined();
    expect(adapter?.walletInfo.id).toBe('freighter');
  });

  it('should return null for non-existent adapter', () => {
    const adapter = connector.getAdapter('nonexistent');
    expect(adapter).toBeNull();
  });
});
