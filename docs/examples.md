# Examples

## Basic Connection

```typescript
import { StellarWalletConnector } from '@stellar-wallet-connector/core';

const connector = new StellarWalletConnector({
  network: 'testnet'
});

// List available wallets
const wallets = connector.getAvailableWallets();
console.log('Available wallets:', wallets);

// Connect to Freighter
try {
  const result = await connector.connect('freighter');
  console.log('Connected!', result.publicKey);
} catch (error) {
  console.error('Connection failed:', error);
}
```

## Transaction Signing

```typescript
import { TransactionBuilder, Operation, Asset, Networks } from '@stellar/stellar-sdk';

// Create a payment transaction
const transaction = new TransactionBuilder(sourceAccount, {
  fee: '100000',
  networkPassphrase: Networks.TESTNET
})
.addOperation(Operation.payment({
  destination: 'GDESTINATION...',
  asset: Asset.native(),
  amount: '10'
}))
.setTimeout(30)
.build();

// Sign with connected wallet
const result = await connector.signTransaction(transaction.toXDR());
console.log('Signed transaction:', result.signedXDR);
```

## React Component Example

```tsx
import React, { useState } from 'react';
import { StellarWalletConnector } from '@stellar-wallet-connector/core';
import { WalletConnector } from '@stellar-wallet-connector/react';

const connector = new StellarWalletConnector();

function PaymentApp() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const sendPayment = async () => {
    if (!publicKey || !recipient || !amount) return;

    try {
      // Create transaction (implementation depends on your setup)
      const transaction = createPaymentTransaction(publicKey, recipient, amount);
      
      // Sign with wallet
      const result = await connector.signTransaction(transaction.toXDR());
      
      // Submit to network (implementation depends on your setup)
      await submitTransaction(result.signedXDR);
      
      alert('Payment sent successfully!');
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed: ' + error.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Stellar Payment App</h1>
      
      <WalletConnector
        connector={connector}
        onConnect={setPublicKey}
        onDisconnect={() => setPublicKey(null)}
      />
      
      {publicKey && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium">Recipient</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="mt-1 block w-full border rounded-md px-3 py-2"
              placeholder="GDESTINATION..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium">Amount (XLM)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full border rounded-md px-3 py-2"
              placeholder="10"
            />
          </div>
          
          <button
            onClick={sendPayment}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Send Payment
          </button>
        </div>
      )}
    </div>
  );
}
```

## Custom Wallet Adapter

```typescript
import { BaseWalletAdapter, WalletInfo, ConnectResult, SignTransactionResult } from '@stellar-wallet-connector/core';

class MyCustomWalletAdapter extends BaseWalletAdapter {
  walletInfo: WalletInfo = {
    id: 'my-wallet',
    name: 'My Custom Wallet',
    icon: '/my-wallet-icon.png',
    description: 'A custom wallet implementation',
    website: 'https://mywallet.com',
    installed: false
  };

  constructor() {
    super();
    this.walletInfo.installed = this.isInstalled();
  }

  isInstalled(): boolean {
    return typeof window !== 'undefined' && !!(window as any).myWallet;
  }

  async connect(): Promise<ConnectResult> {
    this.checkInstallation();
    
    try {
      const wallet = (window as any).myWallet;
      const publicKey = await wallet.connect();
      
      return {
        publicKey,
        wallet: this.walletInfo
      };
    } catch (error) {
      throw new Error(`Failed to connect to My Wallet: ${error}`);
    }
  }

  async disconnect(): Promise<void> {
    const wallet = (window as any).myWallet;
    if (wallet?.disconnect) {
      await wallet.disconnect();
    }
  }

  async signTransaction(xdr: string, options?: SignOptions): Promise<SignTransactionResult> {
    this.checkInstallation();
    
    try {
      const wallet = (window as any).myWallet;
      const signedXDR = await wallet.signTransaction(xdr, options);
      
      return {
        signedXDR,
        signerAddress: this.getPublicKey()!
      };
    } catch (error) {
      throw new Error(`Failed to sign transaction: ${error}`);
    }
  }

  getPublicKey(): string | null {
    // Implementation depends on your wallet's API
    return null;
  }

  isConnected(): boolean {
    // Implementation depends on your wallet's API
    return false;
  }
}

// Use custom adapter
const connector = new StellarWalletConnector({
  adapters: [new MyCustomWalletAdapter()]
});
```

## Error Handling

```typescript
import { StellarWalletConnector } from '@stellar-wallet-connector/core';

const connector = new StellarWalletConnector();

async function connectWithErrorHandling() {
  try {
    const result = await connector.connect('freighter');
    console.log('Connected successfully:', result);
  } catch (error) {
    if (error.message.includes('not installed')) {
      // Handle wallet not installed
      showInstallationGuide('freighter');
    } else if (error.message.includes('User rejected')) {
      // Handle user rejection
      console.log('User cancelled connection');
    } else {
      // Handle other errors
      console.error('Unexpected error:', error);
    }
  }
}

async function signWithErrorHandling(transactionXDR: string) {
  try {
    const result = await connector.signTransaction(transactionXDR);
    return result;
  } catch (error) {
    if (error.message.includes('No wallet connected')) {
      // Prompt user to connect first
      await connectWithErrorHandling();
      // Retry signing
      return await connector.signTransaction(transactionXDR);
    } else {
      throw error;
    }
  }
}
```

## Network Configuration

```typescript
// Testnet configuration
const testnetConnector = new StellarWalletConnector({
  network: 'testnet'
});

// Mainnet configuration
const mainnetConnector = new StellarWalletConnector({
  network: 'mainnet'
});

// Check which network is being used
const currentNetwork = connector.options.network;
console.log('Current network:', currentNetwork);
```

## Multiple Wallet Support

```typescript
function WalletSelector() {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  
  const installedWallets = connector.getInstalledWallets();
  
  return (
    <div className="space-y-2">
      <h3>Choose a wallet:</h3>
      {installedWallets.map(wallet => (
        <button
          key={wallet.id}
          onClick={() => connector.connect(wallet.id)}
          className="flex items-center space-x-2 p-3 border rounded hover:bg-gray-50"
        >
          {wallet.icon && <img src={wallet.icon} alt={wallet.name} className="w-6 h-6" />}
          <span>{wallet.name}</span>
        </button>
      ))}
      
      {installedWallets.length === 0 && (
        <p>No wallets installed. Please install a Stellar wallet.</p>
      )}
    </div>
  );
}
```
