# Stellar Universal Wallet Connector

A unified SDK for connecting dApps to multiple Stellar wallets with a single, consistent API.

## 🌟 Features

- 🔌 **Universal interface** for all Stellar wallets
- ⚡ **Auto-detection** of installed wallets
- 🎯 **TypeScript support** with full type safety
- ⚛️ **React components** included
- 🧪 **Comprehensive test coverage** (50%+ automated tests)
- 📱 **Mobile wallet support**
- 🌱 **KALE farming integration** (Proof-of-Teamwork token)
- 🔐 **Transaction signing** with multiple wallet support
- 🎨 **Beautiful UI components** with responsive design
- 🔄 **Real-time wallet status** monitoring
- ⚠️ **Error handling** with user-friendly messages

## 🚀 Quick Start

```bash
npm install @stellar-wallet-connector/core @stellar-wallet-connector/react @stellar-wallet-connector/kale
```

### Basic Usage

```typescript
import { StellarWalletConnector } from '@stellar-wallet-connector/core';

const connector = new StellarWalletConnector({
  network: 'testnet', // or 'mainnet'
  autoConnect: false
});

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

### KALE Farming Integration

```tsx
import { StellarWalletConnector } from '@stellar-wallet-connector/core';
import { KaleFarmDashboard } from '@stellar-wallet-connector/kale';

const connector = new StellarWalletConnector();
const kaleService = new KaleService({ network: 'testnet' });

// Plant KALE tokens
await kaleService.plant('1000000000', connector); // 1000 KALE

// Submit proof-of-work
await kaleService.work('hash_string_here', connector);

// Harvest rewards
await kaleService.harvest(connector);
```

## 💼 Supported Wallets

| Wallet | Status | Browser Extension | Mobile |
|--------|--------|------------------|---------|
| **Freighter** | ✅ Fully Supported | ✅ | ❌ |
| **xBull** | ✅ Fully Supported | ✅ | ❌ |
| **Albedo** | ✅ Fully Supported | ❌ (Web-based) | ✅ |
| **Rabet** | ✅ Fully Supported | ✅ | ❌ |

## 📁 Project Structure

This is a monorepo containing:

- **packages/core**: Main SDK with adapter pattern
- **packages/react**: React-specific components and hooks
- **packages/kale**: KALE farming integration
- **packages/demo**: Example implementation with live demo

## 🌱 KALE Farming

KALE is a Proof-of-Teamwork token on Stellar that rewards collaborative farming:

- **Plant**: Stake KALE tokens to start farming
- **Work**: Submit proof-of-work hashes to compete
- **Harvest**: Claim farming rewards based on stake, time, and hash difficulty

**Contract ID**: `CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA`

## ✅ Implementation Status

### Core Adapters
- ✅ **FreighterAdapter** - Fully implemented and tested
- ✅ **XBullAdapter** - Fully implemented and tested
- ✅ **AlbedoAdapter** - Fully implemented and tested
- ✅ **RabetAdapter** - Fully implemented and tested

### React Components
- ✅ **WalletConnector** - Main component with full functionality
- ✅ **WalletButton** - Connect/disconnect with loading states
- ✅ **WalletModal** - Wallet selection interface
- ✅ **useStellarWallet** - React hook with state management

### KALE Farming
- ✅ **KaleService** - Plant, Work, Harvest operations
- ✅ **KaleFarmDashboard** - Complete farming UI
- ✅ **Soroban integration** - Smart contract interactions
- ✅ **Real-time status** - Farming status monitoring

### Testing
- ✅ **Unit tests** - Core functionality covered
- ✅ **Integration tests** - Component interactions
- ✅ **Manual testing** - End-to-end flows validated
- ✅ **Demo testing** - Local environment verified

### Demo Application
- ✅ **Next.js app** - Production-ready demo
- ✅ **Live demo** - Running at http://localhost:3000
- ✅ **Responsive design** - Mobile and desktop friendly
- ✅ **Error handling** - User-friendly error messages

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server (demo at http://localhost:3000)
npm run dev

# Run all tests
npm test

# Build all packages
npm run build

# Build specific package
npm run build:kale

# Test specific package
cd packages/core && npm test
cd packages/kale && npm test
```

## 🧪 Testing the Implementation

### Manual Testing
```bash
# Start the demo
npm run dev

# Open http://localhost:3000 in your browser
# Test wallet connections (you'll need to install wallets)
# Test KALE farming functionality
```

### Automated Testing
```bash
# Run all tests
npm test

# Test coverage includes:
# - Wallet adapter functionality
# - Transaction signing flows
# - React component interactions
# - KALE service operations
```

### Integration Testing
- ✅ **Demo loads successfully** - Verified at http://localhost:3000
- ✅ **Wallet detection works** - Shows installed/available wallets
- ✅ **UI is responsive** - Works on mobile and desktop
- ✅ **Error handling** - Graceful error messages displayed
- ✅ **Build pipeline** - All packages compile without errors

## 📚 Documentation

- [API Reference](./docs/api.md)
- [React Integration](./docs/react.md)
- [KALE Farming Guide](./docs/kale.md)
- [Examples](./docs/examples.md)

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests for specific package
cd packages/core && npm test
cd packages/kale && npm test
```

## 🎯 API Reference

### StellarWalletConnector

```typescript
class StellarWalletConnector {
  constructor(options?: StellarWalletConnectorOptions);

  // Wallet management
  getAvailableWallets(): WalletInfo[];
  getInstalledWallets(): WalletInfo[];
  connect(walletId: string): Promise<ConnectResult>;
  disconnect(): Promise<void>;

  // Transaction signing
  signTransaction(xdr: string, options?: SignOptions): Promise<SignTransactionResult>;

  // Status
  isConnected(): boolean;
  getPublicKey(): string | null;
  getCurrentWallet(): WalletInfo | null;
}
```

### KaleService

```typescript
class KaleService {
  constructor(options?: KaleFarmOptions);

  // Farming operations
  plant(stakeAmount: string, connector: StellarWalletConnector): Promise<KaleTransactionResult>;
  work(hash: string, connector: StellarWalletConnector): Promise<KaleTransactionResult>;
  harvest(connector: StellarWalletConnector): Promise<KaleTransactionResult>;

  // Status and calculations
  getFarmStatus(address: string): Promise<KaleFarmStatus>;
  estimateReward(stake: number, gap: number, zeros: number): KaleRewardEstimate;
  countLeadingZeros(hash: string): number;
}
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Make changes with tests
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Stellar SDK](https://github.com/stellar/js-stellar-sdk)
- KALE farming integration
- Community wallet developers

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

## License

MIT License - see [LICENSE](./LICENSE) file for details.
