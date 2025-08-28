import { useState, useEffect, useCallback } from 'react';
import { StellarWalletConnector, WalletInfo, ConnectResult, SignTransactionResult } from '@stellar-wallet-connector/core';

interface UseStellarWalletReturn {
  connector: StellarWalletConnector;
  isConnected: boolean;
  publicKey: string | null;
  currentWallet: WalletInfo | null;
  availableWallets: WalletInfo[];
  installedWallets: WalletInfo[];
  connect: (walletId: string) => Promise<ConnectResult>;
  disconnect: () => Promise<void>;
  signTransaction: (xdr: string) => Promise<SignTransactionResult>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export const useStellarWallet = (connector: StellarWalletConnector): UseStellarWalletReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [currentWallet, setCurrentWallet] = useState<WalletInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableWallets, setAvailableWallets] = useState<WalletInfo[]>([]);
  const [installedWallets, setInstalledWallets] = useState<WalletInfo[]>([]);

  // Update wallet lists
  const updateWalletLists = useCallback(() => {
    setAvailableWallets(connector.getAvailableWallets());
    setInstalledWallets(connector.getInstalledWallets());
  }, [connector]);

  // Initialize state from connector
  useEffect(() => {
    const updateState = () => {
      setIsConnected(connector.isConnected());
      setPublicKey(connector.getPublicKey());
      setCurrentWallet(connector.getCurrentWallet());
      updateWalletLists();
    };

    updateState();

    // Set up a periodic check for wallet availability changes
    const interval = setInterval(updateState, 2000);
    return () => clearInterval(interval);
  }, [connector, updateWalletLists]);

  const connect = useCallback(async (walletId: string): Promise<ConnectResult> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log(`🔌 Connecting to ${walletId}...`);
      const result = await connector.connect(walletId);
      setIsConnected(true);
      setPublicKey(result.publicKey);
      setCurrentWallet(result.wallet);
      updateWalletLists();

      console.log(`✅ Successfully connected to ${result.wallet.name}`);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      console.error('❌ Connection failed:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [connector, updateWalletLists]);

  const disconnect = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔌 Disconnecting wallet...');
      await connector.disconnect();
      setIsConnected(false);
      setPublicKey(null);
      setCurrentWallet(null);
      updateWalletLists();

      console.log('✅ Successfully disconnected');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to disconnect wallet';
      console.error('❌ Disconnect failed:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [connector, updateWalletLists]);

  const signTransaction = useCallback(async (xdr: string): Promise<SignTransactionResult> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('✍️ Signing transaction...');
      const result = await connector.signTransaction(xdr);
      console.log('✅ Transaction signed successfully');
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign transaction';
      console.error('❌ Signing failed:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [connector]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    connector,
    isConnected,
    publicKey,
    currentWallet,
    availableWallets,
    installedWallets,
    connect,
    disconnect,
    signTransaction,
    isLoading,
    error,
    clearError
  };
};
