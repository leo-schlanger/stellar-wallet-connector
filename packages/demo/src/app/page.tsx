'use client';

import React, { useState } from 'react';
import { StellarWalletConnector } from '@stellar-wallet-connector/core';
import { WalletConnector } from '@stellar-wallet-connector/react';
import { Asset, Operation, TransactionBuilder, Networks, Server } from '@stellar/stellar-sdk';

const connector = new StellarWalletConnector({
  network: 'testnet',
  autoConnect: false
});

function App() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [txResult, setTxResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = (pk: string) => {
    setPublicKey(pk);
    setError(null);
    console.log('Connected with public key:', pk);
  };

  const handleDisconnect = () => {
    setPublicKey(null);
    setTxResult(null);
    setError(null);
    console.log('Disconnected');
  };

  const testTransaction = async () => {
    if (!publicKey) return;

    setIsLoading(true);
    setError(null);

    try {
      const server = new Server('https://horizon-testnet.stellar.org');
      
      // Load the account
      const account = await server.loadAccount(publicKey);
      
      // Create a simple payment transaction
      const transaction = new TransactionBuilder(account, {
        fee: '100000',
        networkPassphrase: Networks.TESTNET
      })
      .addOperation(Operation.payment({
        destination: publicKey, // Send to self for demo
        asset: Asset.native(),
        amount: '0.0000001'
      }))
      .setTimeout(30)
      .build();

      const result = await connector.signTransaction(transaction.toXDR());
      setTxResult(result.signedXDR);
    } catch (error) {
      console.error('Transaction failed:', error);
      setError(error instanceof Error ? error.message : 'Transaction failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
          Stellar Universal Wallet Connector
        </h1>
        <p className="text-center text-gray-600 mb-8 text-lg">
          A unified SDK for connecting dApps to multiple Stellar wallets with a single, consistent API.
        </p>
        
        <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Connect Your Wallet</h2>
          <WalletConnector
            connector={connector}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
          
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded p-4">
              <h3 className="font-semibold text-red-800">Error</h3>
              <p className="text-red-600">{error}</p>
            </div>
          )}
          
          {publicKey && (
            <div className="mt-6 space-y-4">
              <div className="bg-green-50 border border-green-200 rounded p-4">
                <h3 className="font-semibold text-green-800">Connected!</h3>
                <p className="text-green-600 font-mono text-sm break-all">
                  {publicKey}
                </p>
                <p className="text-green-700 text-sm mt-2">
                  Wallet: {connector.getCurrentWallet()?.name}
                </p>
              </div>
              
              <button
                onClick={testTransaction}
                disabled={isLoading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading && (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                )}
                <span>{isLoading ? 'Signing...' : 'Test Transaction Signing'}</span>
              </button>
              
              {txResult && (
                <div className="bg-blue-50 border border-blue-200 rounded p-4">
                  <h3 className="font-semibold text-blue-800">Transaction Signed!</h3>
                  <p className="text-blue-600 font-mono text-xs break-all mt-2">
                    {txResult}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Available Wallets</h2>
          <p className="text-gray-600 mb-4">
            The SDK automatically detects installed wallets and provides a unified interface for all supported Stellar wallets.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {connector.getAvailableWallets().map(wallet => (
              <div key={wallet.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  {wallet.icon && (
                    <img 
                      src={wallet.icon} 
                      alt={wallet.name}
                      className="w-8 h-8"
                    />
                  )}
                  <h3 className="font-semibold text-gray-900">{wallet.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">{wallet.description}</p>
                <div className="flex items-center justify-between">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    wallet.installed 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {wallet.installed ? 'Installed' : 'Not Installed'}
                  </div>
                  {!wallet.installed && wallet.website && (
                    <a
                      href={wallet.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                    >
                      Install
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-8 bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">🔌</div>
              <div>
                <h3 className="font-semibold text-gray-900">Universal Interface</h3>
                <p className="text-sm text-gray-600">One API for all Stellar wallets</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-2xl">⚡</div>
              <div>
                <h3 className="font-semibold text-gray-900">Auto-detection</h3>
                <p className="text-sm text-gray-600">Automatically finds installed wallets</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-2xl">🎯</div>
              <div>
                <h3 className="font-semibold text-gray-900">TypeScript</h3>
                <p className="text-sm text-gray-600">Full type safety and IntelliSense</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-2xl">⚛️</div>
              <div>
                <h3 className="font-semibold text-gray-900">React Ready</h3>
                <p className="text-sm text-gray-600">Pre-built React components</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-2xl">🧪</div>
              <div>
                <h3 className="font-semibold text-gray-900">Well Tested</h3>
                <p className="text-sm text-gray-600">Comprehensive test coverage</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-2xl">📱</div>
              <div>
                <h3 className="font-semibold text-gray-900">Mobile Support</h3>
                <p className="text-sm text-gray-600">Works with mobile wallets</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
