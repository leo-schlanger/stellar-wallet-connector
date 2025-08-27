import { StellarWalletConnector } from './packages/core/dist/index.esm.js';

// Criar uma instância do conector
const connector = new StellarWalletConnector({
  network: 'testnet',
  autoConnect: false
});

console.log('=== Teste do Stellar Wallet Connector ===\n');

// Testar funcionalidades básicas
console.log('1. Carteiras disponíveis:');
const availableWallets = connector.getAvailableWallets();
availableWallets.forEach(wallet => {
  console.log(`   - ${wallet.name} (${wallet.id}): ${wallet.installed ? 'Instalada' : 'Não instalada'}`);
});

console.log('\n2. Carteiras instaladas:');
const installedWallets = connector.getInstalledWallets();
if (installedWallets.length === 0) {
  console.log('   Nenhuma carteira instalada detectada');
} else {
  installedWallets.forEach(wallet => {
    console.log(`   - ${wallet.name} (${wallet.id})`);
  });
}

console.log('\n3. Estado da conexão:');
console.log(`   - Conectado: ${connector.isConnected()}`);
console.log(`   - Public Key: ${connector.getPublicKey() || 'Nenhuma'}`);
console.log(`   - Carteira atual: ${connector.getCurrentWallet()?.name || 'Nenhuma'}`);

console.log('\n=== Teste concluído ===');
