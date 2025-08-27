import React from 'react';
import { WalletInfo } from '@stellar-wallet-connector/core';

interface WalletButtonProps {
  isConnected: boolean;
  publicKey: string | null;
  currentWallet: WalletInfo | null;
  onConnect: () => void;
  onDisconnect: () => void;
  className?: string;
}

export const WalletButton: React.FC<WalletButtonProps> = ({
  isConnected,
  publicKey,
  currentWallet,
  onConnect,
  onDisconnect,
  className = ""
}) => {
  const baseClasses = "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  if (isConnected && publicKey && currentWallet) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-md px-3 py-2">
          {currentWallet.icon && (
            <img 
              src={currentWallet.icon} 
              alt={currentWallet.name}
              className="w-5 h-5"
            />
          )}
          <span className="text-sm font-medium text-green-800">
            {currentWallet.name}
          </span>
          <span className="text-xs text-green-600 font-mono">
            {`${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`}
          </span>
        </div>
        <button
          onClick={onDisconnect}
          className={`${baseClasses} bg-red-500 text-white hover:bg-red-600 focus:ring-red-500`}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onConnect}
      className={`${baseClasses} bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500 ${className}`}
    >
      Connect Wallet
    </button>
  );
};
