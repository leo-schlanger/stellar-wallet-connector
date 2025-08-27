# Stellar Universal Wallet Connector

A unified SDK for connecting dApps to multiple Stellar wallets with a single, consistent API.

## Features

- 🔌 Universal interface for all Stellar wallets
- ⚡ Auto-detection of installed wallets  
- 🎯 TypeScript support with full type safety
- ⚛️ React components included
- 🧪 Comprehensive test coverage
- 📱 Mobile wallet support

## Quick Start

```bash
npm install @stellar-wallet-connector/core @stellar-wallet-connector/react
```

### Basic Usage

```typescript
import { StellarWalletConnector } from '@stellar-wallet-connector/core';

const connector = new StellarWalletConnector();

// Connect to a wallet
const result = await connector.connect('freighter');
console.log('Connected:', result.publicKey);

// Sign a transaction  
const signed = await connector.signTransaction(transactionXDR);
```

### React Integration

```tsx
import { StellarWalletConnector } from '@stellar-wallet-connector/core';
import { WalletConnector } from '@stellar-wallet-connector/react';

const connector = new StellarWalletConnector();

function App() {
  return (
    <WalletConnector
      connector={connector}
      onConnect={(publicKey) => console.log('Connected:', publicKey)}
      onDisconnect={() => console.log('Disconnected')}
    />
  );
}
```

## Supported Wallets

- ✅ Freighter
- ✅ xBull  
- ✅ Albedo
- ✅ Rabet
- 🔄 More coming soon...

## Project Structure

This is a monorepo containing:

- **packages/core**: Main SDK with adapter pattern
- **packages/react**: React-specific components and hooks
- **packages/demo**: Example implementation

## Development

```bash
# Install dependencies
npm install

# Start development
npm run dev

# Run tests
npm test

# Build all packages
npm run build
```

## Documentation

- [API Reference](./docs/api.md)
- [React Integration](./docs/react.md)
- [Examples](./docs/examples.md)

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

## License

MIT License - see [LICENSE](./LICENSE) file for details.
