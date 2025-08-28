import { BaseWalletAdapter } from './base';
import { WalletInfo, ConnectResult, SignTransactionResult, SignOptions } from '../types';

// Freighter wallet API interface
interface FreighterAPI {
  isConnected(): Promise<boolean>;
  requestAccess(): Promise<string>;
  signTransaction(xdr: string, options?: SignOptions): Promise<string>;
  getPublicKey(): Promise<string>;
  disconnect(): Promise<void>;
}

// Extend window interface for Freighter
declare global {
  interface Window {
    freighter?: FreighterAPI;
  }
}

export class FreighterAdapter extends BaseWalletAdapter {
  walletInfo: WalletInfo = {
    id: 'freighter',
    name: 'Freighter',
    icon: 'https://freighter.app/favicon.ico',
    description: 'A browser extension for Stellar',
    website: 'https://freighter.app',
    installed: false,
    mobile: false
  };

  private currentPublicKey: string | null = null;

  constructor() {
    super();
    this.walletInfo.installed = this.isInstalled();
  }

  isInstalled(): boolean {
    return typeof window !== 'undefined' && !!window.freighter;
  }

  async connect(): Promise<ConnectResult> {
    this.checkInstallation();

    try {
      console.log('🔗 Connecting to Freighter...');
      const publicKey = await window.freighter!.requestAccess();
      this.currentPublicKey = publicKey;
      console.log('✅ Connected to Freighter:', publicKey);

      return {
        publicKey,
        wallet: this.walletInfo
      };
    } catch (error) {
      console.error('❌ Failed to connect to Freighter:', error);
      throw new Error(`Failed to connect to Freighter: ${error instanceof Error ? error.message : error}`);
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (window.freighter?.disconnect) {
        await window.freighter.disconnect();
        console.log('✅ Disconnected from Freighter');
      }
      this.currentPublicKey = null;
    } catch (error) {
      console.error('❌ Error disconnecting from Freighter:', error);
      throw error;
    }
  }

  async signTransaction(xdr: string, options?: SignOptions): Promise<SignTransactionResult> {
    this.checkInstallation();

    if (!this.isConnected()) {
      throw new Error('Freighter not connected');
    }

    try {
      console.log('✍️ Signing transaction with Freighter...');
      const signedXDR = await window.freighter!.signTransaction(xdr, options);
      const publicKey = this.getPublicKey();

      console.log('✅ Transaction signed successfully');

      return {
        signedXDR,
        signerAddress: publicKey!
      };
    } catch (error) {
      console.error('❌ Failed to sign transaction with Freighter:', error);
      throw new Error(`Failed to sign transaction: ${error instanceof Error ? error.message : error}`);
    }
  }

  getPublicKey(): string | null {
    return this.currentPublicKey;
  }

  isConnected(): boolean {
    return this.currentPublicKey !== null;
  }
}
