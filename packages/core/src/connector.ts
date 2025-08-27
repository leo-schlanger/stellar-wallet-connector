import { WalletAdapter, StellarWalletConnectorOptions, ConnectResult, SignTransactionResult, WalletInfo } from './types';
import { FreighterAdapter } from './adapters/freighter';
import { XBullAdapter } from './adapters/xbull';
import { AlbedoAdapter } from './adapters/albedo';
import { RabetAdapter } from './adapters/rabet';

export class StellarWalletConnector {
  private adapters: Map<string, WalletAdapter> = new Map();
  private currentAdapter: WalletAdapter | null = null;
  private options: StellarWalletConnectorOptions;

  constructor(options: StellarWalletConnectorOptions = {}) {
    this.options = {
      network: 'testnet',
      autoConnect: false,
      ...options
    };

    this.initializeAdapters();
  }

  private initializeAdapters(): void {
    const defaultAdapters = [
      new FreighterAdapter(),
      new XBullAdapter(),
      new AlbedoAdapter(),
      new RabetAdapter()
    ];

    const adaptersToUse = this.options.adapters || defaultAdapters;
    
    adaptersToUse.forEach(adapter => {
      this.adapters.set(adapter.walletInfo.id, adapter);
    });
  }

  getAvailableWallets(): WalletInfo[] {
    return Array.from(this.adapters.values()).map(adapter => adapter.walletInfo);
  }

  getInstalledWallets(): WalletInfo[] {
    return this.getAvailableWallets().filter(wallet => wallet.installed);
  }

  async connect(walletId: string): Promise<ConnectResult> {
    const adapter = this.adapters.get(walletId);
    if (!adapter) {
      throw new Error(`Wallet with id "${walletId}" not found`);
    }

    const result = await adapter.connect();
    this.currentAdapter = adapter;
    
    return result;
  }

  async disconnect(): Promise<void> {
    if (this.currentAdapter) {
      await this.currentAdapter.disconnect();
      this.currentAdapter = null;
    }
  }

  async signTransaction(xdr: string): Promise<SignTransactionResult> {
    if (!this.currentAdapter) {
      throw new Error('No wallet connected');
    }

    return await this.currentAdapter.signTransaction(xdr, {
      networkPassphrase: this.options.network === 'mainnet' 
        ? 'Public Global Stellar Network ; September 2015'
        : 'Test SDF Network ; September 2015'
    });
  }

  getCurrentWallet(): WalletInfo | null {
    return this.currentAdapter?.walletInfo || null;
  }

  isConnected(): boolean {
    return this.currentAdapter ? this.currentAdapter.isConnected() : false;
  }

  getPublicKey(): string | null {
    return this.currentAdapter?.getPublicKey() || null;
  }
}
