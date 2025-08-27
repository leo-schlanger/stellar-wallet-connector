import { BaseWalletAdapter } from './base';
import { WalletInfo, ConnectResult, SignTransactionResult, SignOptions } from '../types';

declare global {
  interface Window {
    rabet?: {
      connect(): Promise<{ address: string }>;
      sign(xdr: string, network?: string): Promise<{ xdr: string }>;
      disconnect(): Promise<void>;
      isConnected(): Promise<boolean>;
    };
  }
}

export class RabetAdapter extends BaseWalletAdapter {
  walletInfo: WalletInfo = {
    id: 'rabet',
    name: 'Rabet',
    icon: 'https://rabet.io/favicon.ico',
    description: 'A browser extension for Stellar',
    website: 'https://rabet.io',
    installed: false
  };

  private currentPublicKey: string | null = null;

  constructor() {
    super();
    this.walletInfo.installed = this.isInstalled();
  }

  isInstalled(): boolean {
    return typeof window !== 'undefined' && !!window.rabet;
  }

  async connect(): Promise<ConnectResult> {
    this.checkInstallation();
    
    try {
      const result = await window.rabet!.connect();
      this.currentPublicKey = result.address;
      return {
        publicKey: result.address,
        wallet: this.walletInfo
      };
    } catch (error) {
      throw new Error(`Failed to connect to Rabet: ${error}`);
    }
  }

  async disconnect(): Promise<void> {
    if (window.rabet?.disconnect) {
      await window.rabet.disconnect();
    }
    this.currentPublicKey = null;
  }

  async signTransaction(xdr: string, options?: SignOptions): Promise<SignTransactionResult> {
    this.checkInstallation();
    
    try {
      const result = await window.rabet!.sign(xdr, options?.networkPassphrase);
      
      return {
        signedXDR: result.xdr,
        signerAddress: this.currentPublicKey!
      };
    } catch (error) {
      throw new Error(`Failed to sign transaction: ${error}`);
    }
  }

  getPublicKey(): string | null {
    return this.currentPublicKey;
  }

  isConnected(): boolean {
    return this.currentPublicKey !== null;
  }
}
