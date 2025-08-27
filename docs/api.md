# API Reference

## Core Package (@stellar-wallet-connector/core)

### StellarWalletConnector

Main class for wallet management.

#### Constructor

```typescript
new StellarWalletConnector(options?: StellarWalletConnectorOptions)
```

**Options:**
- `network`: 'testnet' | 'mainnet' (default: 'testnet')
- `autoConnect`: boolean (default: false)
- `adapters`: WalletAdapter[] (default: all built-in adapters)

#### Methods

##### getAvailableWallets()
Returns all supported wallets.

```typescript
getAvailableWallets(): WalletInfo[]
```

##### getInstalledWallets()
Returns only installed wallets.

```typescript
getInstalledWallets(): WalletInfo[]
```

##### connect(walletId)
Connects to a specific wallet.

```typescript
connect(walletId: string): Promise<ConnectResult>
```

##### disconnect()
Disconnects current wallet.

```typescript
disconnect(): Promise<void>
```

##### signTransaction(xdr)
Signs a transaction.

```typescript
signTransaction(xdr: string): Promise<SignTransactionResult>
```

##### getCurrentWallet()
Gets current connected wallet info.

```typescript
getCurrentWallet(): WalletInfo | null
```

##### isConnected()
Checks if a wallet is connected.

```typescript
isConnected(): boolean
```

##### getPublicKey()
Gets current wallet's public key.

```typescript
getPublicKey(): string | null
```

## Types

### WalletInfo
```typescript
interface WalletInfo {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  website?: string;
  installed: boolean;
  mobile?: boolean;
}
```

### ConnectResult
```typescript
interface ConnectResult {
  publicKey: string;
  wallet: WalletInfo;
}
```

### SignTransactionResult
```typescript
interface SignTransactionResult {
  signedXDR: string;
  signerAddress: string;
}
```

### SignOptions
```typescript
interface SignOptions {
  networkPassphrase?: string;
  accountToSign?: string;
}
```

## Wallet Adapters

### Creating Custom Adapters

Extend the `BaseWalletAdapter` class:

```typescript
import { BaseWalletAdapter } from '@stellar-wallet-connector/core';

class MyWalletAdapter extends BaseWalletAdapter {
  walletInfo = {
    id: 'my-wallet',
    name: 'My Wallet',
    // ... other properties
  };

  isInstalled() {
    return typeof window !== 'undefined' && !!window.myWallet;
  }

  async connect() {
    // Implementation
  }

  // ... other required methods
}
```
