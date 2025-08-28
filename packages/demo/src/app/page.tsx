'use client';

import React, { useState } from 'react';
import { StellarWalletConnector } from '@stellar-wallet-connector/core';
import { WalletConnector } from '@stellar-wallet-connector/react';
import { KaleFarmDashboard } from '@stellar-wallet-connector/kale';

// Create connector instance
const connector = new StellarWalletConnector({
  network: 'testnet',
  autoConnect: false
});

function App() {
  const [activeTab, setActiveTab] = useState<'wallet' | 'kale'>('wallet');
  const [connectionStatus, setConnectionStatus] = useState<{
    publicKey: string | null;
    wallet: any;
  } | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const handleConnect = (publicKey: string, wallet: any) => {
    setConnectionStatus({ publicKey, wallet });
    setConnectionError(null);
    console.log('🎉 Wallet connected:', wallet.name, publicKey);
  };

  const handleDisconnect = () => {
    setConnectionStatus(null);
    setConnectionError(null);
    console.log('👋 Wallet disconnected');
  };

  const handleConnectionError = (error: string) => {
    setConnectionError(error);
    console.error('❌ Connection error:', error);
  };

  const isConnected = !!connectionStatus;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🚀 Stellar Wallet Connector
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A unified SDK for connecting dApps to multiple Stellar wallets with a single, consistent API.
            Experience seamless wallet integration with built-in KALE farming support.
          </p>
        </div>

        {/* Tab Navigation */}
        {isConnected && (
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-xl shadow-lg p-2 flex">
              <button
                onClick={() => setActiveTab('wallet')}
                className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === 'wallet'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                🔗 Wallet Connector
              </button>
              <button
                onClick={() => setActiveTab('kale')}
                className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === 'kale'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                🌱 KALE Farming
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Wallet Tab */}
          {activeTab === 'wallet' && (
            <>
              {/* Connection Status */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">🔗 Wallet Connection</h2>

                {/* Error Display */}
                {connectionError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-red-500 text-xl mr-3">⚠️</span>
                      <div>
                        <h3 className="font-semibold text-red-800">Connection Error</h3>
                        <p className="text-red-700">{connectionError}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Wallet Connector Component */}
                <div className="flex justify-center">
                  <WalletConnector
                    connector={connector}
                    onConnect={handleConnect}
                    onDisconnect={handleDisconnect}
                    onError={handleConnectionError}
                    variant="default"
                  />
                </div>

                {/* Connection Info */}
                {isConnected && (
                  <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center mb-4">
                      <span className="text-green-500 text-2xl mr-3">✅</span>
                      <h3 className="text-xl font-semibold text-green-800">Connected Successfully!</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium text-gray-700">Wallet:</span>
                        <p className="text-gray-900">{connectionStatus.wallet.name}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Public Key:</span>
                        <p className="font-mono text-sm text-gray-900 break-all">{connectionStatus.publicKey}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Available Wallets */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">💼 Available Wallets</h2>
                <p className="text-gray-600 mb-6">
                  The SDK automatically detects installed wallets and provides a unified interface for all supported Stellar wallets.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {connector.getAvailableWallets().map(wallet => (
                    <div key={wallet.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-center space-x-4 mb-4">
                        {wallet.icon && (
                          <img
                            src={wallet.icon}
                            alt={wallet.name}
                            className="w-12 h-12 rounded-lg"
                          />
                        )}
                        <div>
                          <h3 className="font-bold text-gray-900">{wallet.name}</h3>
                          {wallet.mobile && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">📱 Mobile</span>}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{wallet.description}</p>
                      <div className="flex items-center justify-between">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          wallet.installed
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {wallet.installed ? '✅ Installed' : '❌ Not Installed'}
                        </div>
                        {!wallet.installed && wallet.website && (
                          <a
                            href={wallet.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                          >
                            Install →
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">✨ Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl">🔌</div>
                    <div>
                      <h3 className="font-bold text-gray-900">Universal Interface</h3>
                      <p className="text-sm text-gray-600">One API for all Stellar wallets</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl">⚡</div>
                    <div>
                      <h3 className="font-bold text-gray-900">Auto-detection</h3>
                      <p className="text-sm text-gray-600">Automatically finds installed wallets</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl">🎯</div>
                    <div>
                      <h3 className="font-bold text-gray-900">TypeScript</h3>
                      <p className="text-sm text-gray-600">Full type safety and IntelliSense</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 bg-pink-50 rounded-lg">
                    <div className="text-3xl">⚛️</div>
                    <div>
                      <h3 className="font-bold text-gray-900">React Ready</h3>
                      <p className="text-sm text-gray-600">Pre-built React components</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 bg-yellow-50 rounded-lg">
                    <div className="text-3xl">🧪</div>
                    <div>
                      <h3 className="font-bold text-gray-900">Well Tested</h3>
                      <p className="text-sm text-gray-600">Comprehensive test coverage</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 bg-indigo-50 rounded-lg">
                    <div className="text-3xl">📱</div>
                    <div>
                      <h3 className="font-bold text-gray-900">Mobile Support</h3>
                      <p className="text-sm text-gray-600">Works with mobile wallets</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* KALE Farming Tab */}
          {activeTab === 'kale' && (
            <>
              {isConnected ? (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <KaleFarmDashboard connector={connector} network="testnet" />
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                  <div className="text-6xl mb-4">🌱</div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">KALE Farming</h2>
                  <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                    Connect your Stellar wallet to start farming KALE tokens. Experience the future of
                    Proof-of-Teamwork farming with seamless wallet integration.
                  </p>
                  <WalletConnector
                    connector={connector}
                    onConnect={handleConnect}
                    onDisconnect={handleDisconnect}
                    onError={handleConnectionError}
                    variant="default"
                  />
                </div>
              )}

              {/* KALE Info */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">🌱 About KALE Farming</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">What is KALE?</h3>
                    <p className="text-gray-600 mb-6">
                      KALE is a revolutionary Proof-of-Teamwork token on Stellar that rewards collaborative farming.
                      Stake KALE tokens, submit proof-of-work hashes, and earn rewards based on your stake,
                      time gap, and hash difficulty.
                    </p>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">How it works:</h3>
                    <ol className="list-decimal list-inside text-gray-600 space-y-3">
                      <li><strong>Plant:</strong> Stake your KALE tokens to start farming</li>
                      <li><strong>Work:</strong> Submit proof-of-work hashes to compete</li>
                      <li><strong>Harvest:</strong> Claim your farming rewards</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Contract Details</h3>
                    <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-green-500">
                      <p className="text-sm text-gray-600 mb-2"><strong>Contract ID:</strong></p>
                      <p className="font-mono text-sm text-gray-800 break-all bg-white p-3 rounded border">
                        CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA
                      </p>
                      <p className="text-sm text-gray-600 mt-4"><strong>Network:</strong> Testnet</p>
                    </div>
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Features</h4>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li>✅ Proof-of-Teamwork farming</li>
                        <li>✅ Variable difficulty mining</li>
                        <li>✅ Time-based reward multipliers</li>
                        <li>✅ Soroban smart contract integration</li>
                        <li>✅ Mobile-friendly interface</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
