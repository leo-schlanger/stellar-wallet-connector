import { BaseWalletAdapter } from './base';
import { WalletInfo, ConnectResult, SignTransactionResult, SignOptions } from '../types';

declare global {
  interface Window {
    freighter?: {
      isConnected(): Promise<boolean>;
      requestAccess(): Promise<string>;
      signTransaction(xdr: string, options?: SignOptions): Promise<string>;
      getPublicKey(): Promise<string>;
      disconnect(): Promise<void>;
    };
  }
}

export class FreighterAdapter extends BaseWalletAdapter {
  walletInfo: WalletInfo = {
    id: 'freighter',
    name: 'Freighter',
    icon: 'https://freighter.app/favicon.ico',
    description: 'A browser extension for Stellar',
    website: 'https://freighter.app',
    installed: false
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
      const publicKey = await window.freighter!.requestAccess();
      this.currentPublicKey = publicKey;
      return {
        publicKey,
        wallet: this.walletInfo
      };
    } catch (error) {
      throw new Error(`Failed to connect to Freighter: ${error}`);
    }
  }

  async disconnect(): Promise<void> {
    if (window.freighter?.disconnect) {
      await window.freighter.disconnect();
    }
    this.currentPublicKey = null;
  }

  async signTransaction(xdr: string, options?: SignOptions): Promise<SignTransactionResult> {
    this.checkInstallation();
    
    try {
      const signedXDR = await window.freighter!.signTransaction(xdr, options);
      const publicKey = this.getPublicKey();
      
      return {
        signedXDR,
        signerAddress: publicKey!
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
