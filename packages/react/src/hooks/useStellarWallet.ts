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
}

export const useStellarWallet = (connector: StellarWalletConnector): UseStellarWalletReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [currentWallet, setCurrentWallet] = useState<WalletInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize state from connector
  useEffect(() => {
    setIsConnected(connector.isConnected());
    setPublicKey(connector.getPublicKey());
    setCurrentWallet(connector.getCurrentWallet());
  }, [connector]);

  const connect = useCallback(async (walletId: string): Promise<ConnectResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await connector.connect(walletId);
      setIsConnected(true);
      setPublicKey(result.publicKey);
      setCurrentWallet(result.wallet);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [connector]);

  const disconnect = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await connector.disconnect();
      setIsConnected(false);
      setPublicKey(null);
      setCurrentWallet(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to disconnect wallet';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [connector]);

  const signTransaction = useCallback(async (xdr: string): Promise<SignTransactionResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await connector.signTransaction(xdr);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign transaction';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [connector]);

  return {
    connector,
    isConnected,
    publicKey,
    currentWallet,
    availableWallets: connector.getAvailableWallets(),
    installedWallets: connector.getInstalledWallets(),
    connect,
    disconnect,
    signTransaction,
    isLoading,
    error
  };
};
