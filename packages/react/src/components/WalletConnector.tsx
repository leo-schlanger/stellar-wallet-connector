import React, { useState, useEffect } from 'react';
import { StellarWalletConnector } from '@stellar-wallet-connector/core';
import { WalletButton } from './WalletButton';
import { WalletModal } from './WalletModal';

interface WalletConnectorProps {
  connector: StellarWalletConnector;
  onConnect?: (publicKey: string) => void;
  onDisconnect?: () => void;
  className?: string;
}

export const WalletConnector: React.FC<WalletConnectorProps> = ({
  connector,
  onConnect,
  onDisconnect,
  className = ""
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  useEffect(() => {
    setIsConnected(connector.isConnected());
    setPublicKey(connector.getPublicKey());
  }, [connector]);

  const handleConnect = async (walletId: string) => {
    try {
      const result = await connector.connect(walletId);
      setIsConnected(true);
      setPublicKey(result.publicKey);
      setIsModalOpen(false);
      onConnect?.(result.publicKey);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await connector.disconnect();
      setIsConnected(false);
      setPublicKey(null);
      onDisconnect?.();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  return (
    <div className={`stellar-wallet-connector ${className}`}>
      <WalletButton
        isConnected={isConnected}
        publicKey={publicKey}
        currentWallet={connector.getCurrentWallet()}
        onConnect={() => setIsModalOpen(true)}
        onDisconnect={handleDisconnect}
      />
      
      <WalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        wallets={connector.getInstalledWallets()}
        onWalletSelect={handleConnect}
      />
    </div>
  );
};
