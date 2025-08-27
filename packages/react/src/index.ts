export * from './components/WalletConnector';
export * from './components/WalletButton';
export * from './components/WalletModal';
export * from './hooks/useStellarWallet';

// Re-export core types for convenience
export type {
  WalletInfo,
  ConnectResult,
  SignTransactionResult,
  WalletAdapter,
  SignOptions,
  StellarWalletConnectorOptions
} from '@stellar-wallet-connector/core';
