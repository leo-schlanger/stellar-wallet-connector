import { WalletAdapter, WalletInfo, ConnectResult, SignTransactionResult, SignOptions } from '../types';

export abstract class BaseWalletAdapter implements WalletAdapter {
  abstract walletInfo: WalletInfo;

  abstract isInstalled(): boolean;
  abstract connect(): Promise<ConnectResult>;
  abstract disconnect(): Promise<void>;
  abstract signTransaction(xdr: string, options?: SignOptions): Promise<SignTransactionResult>;
  abstract getPublicKey(): string | null;
  abstract isConnected(): boolean;

  async signAuthEntry(entryXdr: string, options?: SignOptions): Promise<SignTransactionResult> {
    // Default implementation - can be overridden by specific adapters
    return this.signTransaction(entryXdr, options);
  }

  protected checkInstallation(): void {
    if (!this.isInstalled()) {
      throw new Error(`${this.walletInfo.name} is not installed. Please install it from ${this.walletInfo.website}`);
    }
  }
}
