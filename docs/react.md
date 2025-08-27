# React Integration Guide

## Installation

```bash
npm install @stellar-wallet-connector/core @stellar-wallet-connector/react
```

## Components

### WalletConnector

Main component for wallet connection UI.

```tsx
import { WalletConnector } from '@stellar-wallet-connector/react';
import { StellarWalletConnector } from '@stellar-wallet-connector/core';

const connector = new StellarWalletConnector();

function App() {
  return (
    <WalletConnector
      connector={connector}
      onConnect={(publicKey) => console.log('Connected:', publicKey)}
      onDisconnect={() => console.log('Disconnected')}
      className="my-wallet-connector"
    />
  );
}
```

**Props:**
- `connector`: StellarWalletConnector instance
- `onConnect?`: (publicKey: string) => void
- `onDisconnect?`: () => void
- `className?`: string

### WalletButton

Button component for wallet connection.

```tsx
import { WalletButton } from '@stellar-wallet-connector/react';

<WalletButton
  isConnected={isConnected}
  publicKey={publicKey}
  currentWallet={currentWallet}
  onConnect={() => setModalOpen(true)}
  onDisconnect={handleDisconnect}
/>
```

**Props:**
- `isConnected`: boolean
- `publicKey`: string | null
- `currentWallet`: WalletInfo | null
- `onConnect`: () => void
- `onDisconnect`: () => void
- `className?`: string

### WalletModal

Modal for wallet selection.

```tsx
import { WalletModal } from '@stellar-wallet-connector/react';

<WalletModal
  isOpen={isModalOpen}
  onClose={() => setModalOpen(false)}
  wallets={availableWallets}
  onWalletSelect={handleWalletSelect}
/>
```

**Props:**
- `isOpen`: boolean
- `onClose`: () => void
- `wallets`: WalletInfo[]
- `onWalletSelect`: (walletId: string) => void

## Hooks

### useStellarWallet

Hook for wallet state management.

```tsx
import { useStellarWallet } from '@stellar-wallet-connector/react';
import { StellarWalletConnector } from '@stellar-wallet-connector/core';

const connector = new StellarWalletConnector();

function MyComponent() {
  const {
    isConnected,
    publicKey,
    currentWallet,
    availableWallets,
    installedWallets,
    connect,
    disconnect,
    signTransaction,
    isLoading,
    error
  } = useStellarWallet(connector);

  const handleConnect = async () => {
    try {
      await connect('freighter');
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  return (
    <div>
      {isConnected ? (
        <div>
          <p>Connected: {publicKey}</p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      ) : (
        <button onClick={handleConnect}>Connect</button>
      )}
    </div>
  );
}
```

**Returns:**
- `connector`: StellarWalletConnector
- `isConnected`: boolean
- `publicKey`: string | null
- `currentWallet`: WalletInfo | null
- `availableWallets`: WalletInfo[]
- `installedWallets`: WalletInfo[]
- `connect`: (walletId: string) => Promise<ConnectResult>
- `disconnect`: () => Promise<void>
- `signTransaction`: (xdr: string) => Promise<SignTransactionResult>
- `isLoading`: boolean
- `error`: string | null

## Styling

Components use Tailwind CSS classes by default. You can:

1. **Override with className props**
2. **Use CSS modules**
3. **Apply custom CSS**

```tsx
<WalletConnector
  connector={connector}
  className="my-custom-wallet-connector"
/>
```

```css
.my-custom-wallet-connector {
  /* Custom styles */
}
```

## Advanced Usage

### Custom Error Handling

```tsx
function MyApp() {
  const { connect, error } = useStellarWallet(connector);

  const handleConnect = async (walletId: string) => {
    try {
      await connect(walletId);
    } catch (err) {
      // Handle specific errors
      if (err.message.includes('not installed')) {
        // Show installation guide
      }
    }
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      {/* Rest of component */}
    </div>
  );
}
```

### Loading States

```tsx
function TransactionComponent() {
  const { signTransaction, isLoading } = useStellarWallet(connector);

  const handleSign = async () => {
    try {
      const result = await signTransaction(transactionXDR);
      console.log('Signed:', result);
    } catch (error) {
      console.error('Signing failed:', error);
    }
  };

  return (
    <button onClick={handleSign} disabled={isLoading}>
      {isLoading ? 'Signing...' : 'Sign Transaction'}
    </button>
  );
}
```
