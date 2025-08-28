import React from 'react';
import { WalletInfo } from '@stellar-wallet-connector/core';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallets: WalletInfo[];
  onWalletSelect: (walletId: string) => void;
  isLoading?: boolean;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  wallets,
  onWalletSelect,
  isLoading = false
}) => {
  if (!isOpen) return null;

  const installedWallets = wallets.filter(wallet => wallet.installed);
  const notInstalledWallets = wallets.filter(wallet => !wallet.installed);

  const handleWalletClick = (walletId: string) => {
    if (!isLoading) {
      onWalletSelect(walletId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                🔗 Connect Your Wallet
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                disabled={isLoading}
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {installedWallets.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <span className="mr-2">✅</span>
                    Available Wallets
                  </h4>
                  <div className="space-y-2">
                    {installedWallets.map((wallet) => (
                      <button
                        key={wallet.id}
                        onClick={() => handleWalletClick(wallet.id)}
                        disabled={isLoading}
                        className="w-full flex items-center space-x-3 p-4 border border-green-200 rounded-lg hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 disabled:opacity-50"
                      >
                        {wallet.icon && (
                          <img
                            src={wallet.icon}
                            alt={wallet.name}
                            className="w-10 h-10 rounded-lg"
                          />
                        )}
                        <div className="flex-1 text-left">
                          <div className="text-base font-medium text-gray-900">
                            {wallet.name}
                          </div>
                          {wallet.description && (
                            <div className="text-sm text-gray-500">
                              {wallet.description}
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-green-600 font-medium">
                          {isLoading ? 'Connecting...' : 'Connect'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {notInstalledWallets.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <span className="mr-2">📥</span>
                    Not Installed
                  </h4>
                  <div className="space-y-2">
                    {notInstalledWallets.map((wallet) => (
                      <div
                        key={wallet.id}
                        className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-lg bg-gray-50"
                      >
                        {wallet.icon && (
                          <img
                            src={wallet.icon}
                            alt={wallet.name}
                            className="w-10 h-10 rounded-lg opacity-50"
                          />
                        )}
                        <div className="flex-1 text-left">
                          <div className="text-base font-medium text-gray-500">
                            {wallet.name}
                          </div>
                          {wallet.description && (
                            <div className="text-sm text-gray-400">
                              {wallet.description}
                            </div>
                          )}
                        </div>
                        <a
                          href={wallet.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Install
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {installedWallets.length === 0 && notInstalledWallets.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-2">No wallets detected</div>
                  <div className="text-sm text-gray-400">
                    Please install a Stellar wallet to continue
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
