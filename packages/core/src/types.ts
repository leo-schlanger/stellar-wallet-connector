export interface WalletInfo {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  website?: string;
  installed: boolean;
  mobile?: boolean;
}

export interface ConnectResult {
  publicKey: string;
  wallet: WalletInfo;
}

export interface SignTransactionResult {
  signedXDR: string;
  signerAddress: string;
}

export interface WalletAdapter {
  walletInfo: WalletInfo;
  isInstalled(): boolean;
  connect(): Promise<ConnectResult>;
  disconnect(): Promise<void>;
  signTransaction(xdr: string, options?: SignOptions): Promise<SignTransactionResult>;
  signAuthEntry(entryXdr: string, options?: SignOptions): Promise<SignTransactionResult>;
  getPublicKey(): string | null;
  isConnected(): boolean;
}

export interface SignOptions {
  networkPassphrase?: string;
  accountToSign?: string;
}

export interface StellarWalletConnectorOptions {
  network?: 'testnet' | 'mainnet';
  autoConnect?: boolean;
  adapters?: WalletAdapter[];
}
