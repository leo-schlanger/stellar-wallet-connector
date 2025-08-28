// Test script to validate adapters are working
import { StellarWalletConnector } from './packages/core/dist/index.js';

console.log('🚀 Testing Stellar Wallet Connector Adapters...\n');

// Create connector
const connector = new StellarWalletConnector({
  network: 'testnet',
  autoConnect: false
});

console.log('✅ Connector created successfully');

// Test available wallets
const availableWallets = connector.getAvailableWallets();
console.log('📱 Available wallets:', availableWallets.length);
availableWallets.forEach(wallet => {
  console.log(`  - ${wallet.name} (${wallet.id}) - ${wallet.installed ? '✅ Installed' : '❌ Not installed'}`);
});

// Test installed wallets
const installedWallets = connector.getInstalledWallets();
console.log('\n🔍 Installed wallets:', installedWallets.length);
installedWallets.forEach(wallet => {
  console.log(`  - ${wallet.name} (${wallet.id})`);
});

// Test connection status
console.log('\n🔗 Connection status:', connector.isConnected() ? 'Connected' : 'Not connected');
console.log('🔑 Public key:', connector.getPublicKey() || 'None');
console.log('👤 Current wallet:', connector.getCurrentWallet()?.name || 'None');

console.log('\n🎉 Adapter validation complete!');
console.log('💡 To test actual wallet connections, you need to have wallets installed and run in a browser environment.');