import React, { useState } from 'react';
import { StellarWalletConnector } from '@stellar-wallet-connector/core';
import { useStellarWallet } from '../hooks/useStellarWallet';
import { WalletButton } from './WalletButton';
import { WalletModal } from './WalletModal';

interface WalletConnectorProps {
  connector: StellarWalletConnector;
  onConnect?: (publicKey: string, wallet: any) => void;
  onDisconnect?: () => void;
  onError?: (error: string) => void;
  className?: string;
  variant?: 'default' | 'compact';
  showModalOnConnect?: boolean;
}

export const WalletConnector: React.FC<WalletConnectorProps> = ({
  connector,
  onConnect,
  onDisconnect,
  onError,
  className = "",
  variant = 'default',
  showModalOnConnect = true
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    isConnected,
    publicKey,
    currentWallet,
    availableWallets,
    installedWallets,
    connect,
    disconnect,
    isLoading,
    error,
    clearError
  } = useStellarWallet(connector);

  const handleConnect = async (walletId: string) => {
    try {
      clearError();
      const result = await connect(walletId);
      setIsModalOpen(false);
      onConnect?.(result.publicKey, result.wallet);
      console.log('🎉 Wallet connected successfully:', result.wallet.name);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet';
      console.error('❌ Connection failed:', errorMessage);
      onError?.(errorMessage);
    }
  };

  const handleDisconnect = async () => {
    try {
      clearError();
      await disconnect();
      onDisconnect?.();
      console.log('👋 Wallet disconnected successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to disconnect wallet';
      console.error('❌ Disconnect failed:', errorMessage);
      onError?.(errorMessage);
    }
  };

  const handleConnectClick = () => {
    if (installedWallets.length === 1 && showModalOnConnect) {
      // If only one wallet is installed, connect directly
      handleConnect(installedWallets[0].id);
    } else if (installedWallets.length > 0) {
      // Show modal to choose wallet
      setIsModalOpen(true);
    } else {
      // No wallets installed, show modal with install options
      setIsModalOpen(true);
    }
  };

  return (
    <div className={`stellar-wallet-connector ${className}`}>
      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">⚠️</span>
              <span className="text-red-800 text-sm">{error}</span>
            </div>
            <button
              onClick={clearError}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Wallet Button */}
      <WalletButton
        isConnected={isConnected}
        publicKey={publicKey}
        currentWallet={currentWallet}
        onConnect={handleConnectClick}
        onDisconnect={handleDisconnect}
        isLoading={isLoading}
        variant={variant}
      />

      {/* Wallet Selection Modal */}
      <WalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        wallets={availableWallets}
        onWalletSelect={handleConnect}
        isLoading={isLoading}
      />
    </div>
  );
};
