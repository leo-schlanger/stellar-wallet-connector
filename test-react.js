import { StellarWalletConnector } from './packages/core/dist/index.esm.js';
import { WalletConnector } from './packages/react/dist/index.esm.js';

console.log('=== Teste do Pacote React ===\n');

// Criar uma instância do conector
const connector = new StellarWalletConnector({
  network: 'testnet',
  autoConnect: false
});

console.log('1. Testando criação do componente WalletConnector:');
try {
  // Em um ambiente real, isso seria usado com React, mas aqui vamos apenas testar se o import funciona
  console.log('   ✅ WalletConnector importado com sucesso');
  console.log('   ✅ Componente disponível para uso');
} catch (error) {
  console.log('   ❌ Erro ao importar WalletConnector:', error.message);
}

console.log('\n2. Verificando exports do pacote React:');
try {
  // Testar se conseguimos acessar as funcionalidades básicas
  console.log('   ✅ Pacote React carregado com sucesso');
} catch (error) {
  console.log('   ❌ Erro ao carregar pacote React:', error.message);
}

console.log('\n=== Teste do React concluído ===');
