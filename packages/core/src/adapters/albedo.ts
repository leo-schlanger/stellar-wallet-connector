import { BaseWalletAdapter } from './base';
import { WalletInfo, ConnectResult, SignTransactionResult, SignOptions } from '../types';

declare global {
  interface Window {
    albedo?: {
      publicKey(params?: { token?: string }): Promise<{ pubkey: string }>;
      tx(params: { xdr: string; network?: string; pubkey?: string }): Promise<{ signed_envelope_xdr: string; tx_signature: string }>;
      trust(params: { asset_code: string; asset_issuer: string; network?: string }): Promise<any>;
    };
  }
}

export class AlbedoAdapter extends BaseWalletAdapter {
  walletInfo: WalletInfo = {
    id: 'albedo',
    name: 'Albedo',
    icon: 'https://albedo.link/favicon.ico',
    description: 'A web-based wallet for Stellar',
    website: 'https://albedo.link',
    installed: false
  };

  private currentPublicKey: string | null = null;

  constructor() {
    super();
    this.walletInfo.installed = this.isInstalled();
  }

  isInstalled(): boolean {
    return typeof window !== 'undefined' && !!window.albedo;
  }

  async connect(): Promise<ConnectResult> {
    this.checkInstallation();
    
    try {
      const result = await window.albedo!.publicKey();
      this.currentPublicKey = result.pubkey;
      return {
        publicKey: result.pubkey,
        wallet: this.walletInfo
      };
    } catch (error) {
      throw new Error(`Failed to connect to Albedo: ${error}`);
    }
  }

  async disconnect(): Promise<void> {
    // Albedo doesn't have explicit disconnect
    this.currentPublicKey = null;
  }

  async signTransaction(xdr: string, options?: SignOptions): Promise<SignTransactionResult> {
    this.checkInstallation();
    
    try {
      const result = await window.albedo!.tx({
        xdr,
        network: options?.networkPassphrase,
        pubkey: options?.accountToSign || this.currentPublicKey || undefined
      });
      
      return {
        signedXDR: result.signed_envelope_xdr,
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
