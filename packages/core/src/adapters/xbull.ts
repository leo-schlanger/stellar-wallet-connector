import { BaseWalletAdapter } from './base';
import { WalletInfo, ConnectResult, SignTransactionResult, SignOptions } from '../types';

declare global {
  interface Window {
    xBullWalletConnect?: {
      connect(): Promise<{ address: string }>;
      sign(params: { xdr: string; network?: string; address?: string }): Promise<{ signedXDR: string }>;
      disconnect(): Promise<void>;
      isConnected(): Promise<boolean>;
    };
  }
}

export class XBullAdapter extends BaseWalletAdapter {
  walletInfo: WalletInfo = {
    id: 'xbull',
    name: 'xBull',
    icon: 'https://xbull.app/favicon.ico',
    description: 'A browser extension for Stellar',
    website: 'https://xbull.app',
    installed: false
  };

  private currentPublicKey: string | null = null;

  constructor() {
    super();
    this.walletInfo.installed = this.isInstalled();
  }

  isInstalled(): boolean {
    return typeof window !== 'undefined' && !!window.xBullWalletConnect;
  }

  async connect(): Promise<ConnectResult> {
    this.checkInstallation();
    
    try {
      const result = await window.xBullWalletConnect!.connect();
      this.currentPublicKey = result.address;
      return {
        publicKey: result.address,
        wallet: this.walletInfo
      };
    } catch (error) {
      throw new Error(`Failed to connect to xBull: ${error}`);
    }
  }

  async disconnect(): Promise<void> {
    if (window.xBullWalletConnect?.disconnect) {
      await window.xBullWalletConnect.disconnect();
    }
    this.currentPublicKey = null;
  }

  async signTransaction(xdr: string, options?: SignOptions): Promise<SignTransactionResult> {
    this.checkInstallation();
    
    try {
      const result = await window.xBullWalletConnect!.sign({
        xdr,
        network: options?.networkPassphrase,
        address: options?.accountToSign || this.currentPublicKey || undefined
      });
      
      return {
        signedXDR: result.signedXDR,
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
