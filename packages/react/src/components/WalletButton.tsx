import React from 'react';
import { WalletInfo } from '@stellar-wallet-connector/core';

interface WalletButtonProps {
  isConnected: boolean;
  publicKey: string | null;
  currentWallet: WalletInfo | null;
  onConnect: () => void;
  onDisconnect: () => void;
  isLoading?: boolean;
  className?: string;
  variant?: 'default' | 'compact';
}

export const WalletButton: React.FC<WalletButtonProps> = ({
  isConnected,
  publicKey,
  currentWallet,
  onConnect,
  onDisconnect,
  isLoading = false,
  className = "",
  variant = 'default'
}) => {
  const baseClasses = "font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  if (isConnected && publicKey && currentWallet) {
    if (variant === 'compact') {
      return (
        <div className={`flex items-center space-x-2 ${className}`}>
          <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            {currentWallet.icon && (
              <img
                src={currentWallet.icon}
                alt={currentWallet.name}
                className="w-4 h-4"
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
            disabled={isLoading}
            className={`${baseClasses} px-3 py-1 bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 text-sm rounded-md`}
          >
            {isLoading ? '...' : '×'}
          </button>
        </div>
      );
    }

    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <div className="flex items-center space-x-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
          {currentWallet.icon && (
            <img
              src={currentWallet.icon}
              alt={currentWallet.name}
              className="w-6 h-6"
            />
          )}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-green-800">
              {currentWallet.name}
            </span>
            <span className="text-xs text-green-600 font-mono">
              {`${publicKey.slice(0, 8)}...${publicKey.slice(-8)}`}
            </span>
          </div>
        </div>
        <button
          onClick={onDisconnect}
          disabled={isLoading}
          className={`${baseClasses} px-4 py-2 bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 rounded-lg`}
        >
          {isLoading ? 'Disconnecting...' : 'Disconnect'}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onConnect}
      disabled={isLoading}
      className={`${baseClasses} px-6 py-3 bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 ${className}`}
    >
      {isLoading ? 'Connecting...' : '🔗 Connect Wallet'}
    </button>
  );
};
