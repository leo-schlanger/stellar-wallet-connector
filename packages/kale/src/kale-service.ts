import {
  Horizon,
  TransactionBuilder,
  Account,
  xdr,
  Contract,
  SorobanRpc,
  Networks,
  Address,
  nativeToScVal,
  scValToNative,
  Transaction
} from '@stellar/stellar-sdk';
import { StellarWalletConnector } from '@stellar-wallet-connector/core';
import { KaleFarmStatus, KaleRewardEstimate, KaleTransactionResult, KaleFarmOptions } from './types';

export class KaleService {
  private contractId: string;
  private network: 'testnet' | 'mainnet';
  private server: Horizon.Server;
  private rpc: SorobanRpc.Server;

  // Endereço do contrato KALE oficial
  private static readonly KALE_CONTRACT_ID = 'CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA';

  constructor(options: KaleFarmOptions = {}) {
    this.contractId = options.contractId || KaleService.KALE_CONTRACT_ID;
    this.network = options.network || 'testnet';

    const networkPassphrase = this.network === 'mainnet'
      ? Networks.PUBLIC
      : Networks.TESTNET;

    this.server = new Horizon.Server(
      this.network === 'mainnet'
        ? 'https://horizon.stellar.org'
        : 'https://horizon-testnet.stellar.org'
    );

    this.rpc = new SorobanRpc.Server(
      this.network === 'mainnet'
        ? 'https://soroban-rpc.mainnet.stellar.org'
        : 'https://soroban-rpc.testnet.stellar.org'
    );
  }

  /**
   * Stake KALE tokens (plant function)
   */
  async plant(
    stakeAmount: string,
    connector: StellarWalletConnector
  ): Promise<KaleTransactionResult> {
    try {
      if (!connector.isConnected()) {
        throw new Error('Wallet not connected');
      }

      const publicKey = connector.getPublicKey();
      if (!publicKey) {
        throw new Error('No public key available');
      }

      // Get account details
      const accountRecord = await this.server.accounts().accountId(publicKey).call();
      const account = new Account(accountRecord.account_id, accountRecord.sequence);

      // Create contract instance
      const contract = new Contract(this.contractId);

      // Build the plant transaction
      const plantAmount = nativeToScVal(BigInt(stakeAmount), { type: 'i128' });

      let transaction = new TransactionBuilder(account, {
        fee: '100',
        networkPassphrase: this.network === 'mainnet' ? Networks.PUBLIC : Networks.TESTNET
      })
        .addOperation(contract.call('plant', plantAmount))
        .setTimeout(30)
        .build();

      // Simulate transaction
      const simulation = await this.rpc.simulateTransaction(transaction);
      if (SorobanRpc.Api.isSimulationError(simulation)) {
        throw new Error(`Simulation failed: ${simulation.error}`);
      }

      // Assemble the transaction with the simulation result
      transaction = SorobanRpc.assembleTransaction(transaction, simulation).build();

      // Sign the transaction
      const signedResult = await connector.signTransaction(transaction.toXDR());

      // Submit the transaction
      const signedTransaction = TransactionBuilder.fromXDR(signedResult.signedXDR, this.network === 'mainnet' ? Networks.PUBLIC : Networks.TESTNET);
      const submitResult = await this.rpc.sendTransaction(signedTransaction);

      if (submitResult.status !== 'PENDING') {
        throw new Error(`Transaction failed: ${submitResult.status}`);
      }

      // Wait for confirmation
      let status: any = submitResult.status;
      let attempts = 0;
      while (status === 'PENDING' && attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const response = await this.rpc.getTransaction(submitResult.hash);
        status = response.status;
        attempts++;
      }

      if (status !== 'SUCCESS') {
        throw new Error(`Transaction failed with status: ${status}`);
      }

      return {
        success: true,
        transactionHash: submitResult.hash
      };

    } catch (error) {
      console.error('Plant transaction failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Submit proof-of-work hash (work function)
   */
  async work(
    hash: string,
    connector: StellarWalletConnector
  ): Promise<KaleTransactionResult> {
    try {
      if (!connector.isConnected()) {
        throw new Error('Wallet not connected');
      }

      const publicKey = connector.getPublicKey();
      if (!publicKey) {
        throw new Error('No public key available');
      }

      // Get account details
      const accountRecord = await this.server.accounts().accountId(publicKey).call();
      const account = new Account(accountRecord.account_id, accountRecord.sequence);

      // Create contract instance
      const contract = new Contract(this.contractId);

      // Convert hash to bytes
      const hashBytes = Buffer.from(hash, 'hex');
      const hashScVal = nativeToScVal(hashBytes, { type: 'bytes' });

      let transaction = new TransactionBuilder(account, {
        fee: '100',
        networkPassphrase: this.network === 'mainnet' ? Networks.PUBLIC : Networks.TESTNET
      })
        .addOperation(contract.call('work', hashScVal))
        .setTimeout(30)
        .build();

      // Simulate transaction
      const simulation = await this.rpc.simulateTransaction(transaction);
      if (SorobanRpc.Api.isSimulationError(simulation)) {
        throw new Error(`Simulation failed: ${simulation.error}`);
      }

      // Assemble the transaction with the simulation result
      transaction = SorobanRpc.assembleTransaction(transaction, simulation)

        .build();

      // Sign the transaction
      const signedResult = await connector.signTransaction(transaction.toXDR());

      // Submit the transaction
      const signedTransaction = TransactionBuilder.fromXDR(signedResult.signedXDR, this.network === 'mainnet' ? Networks.PUBLIC : Networks.TESTNET);
      const submitResult = await this.rpc.sendTransaction(signedTransaction);

      if (submitResult.status !== 'PENDING') {
        throw new Error(`Transaction failed: ${submitResult.status}`);
      }

      // Wait for confirmation
      let status: any = submitResult.status;
      let attempts = 0;
      while (status === 'PENDING' && attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const response = await this.rpc.getTransaction(submitResult.hash);
        status = response.status;
        attempts++;
      }

      if (status !== 'SUCCESS') {
        throw new Error(`Transaction failed with status: ${status}`);
      }

      return {
        success: true,
        transactionHash: submitResult.hash
      };

    } catch (error) {
      console.error('Work transaction failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Claim farming rewards (harvest function)
   */
  async harvest(connector: StellarWalletConnector): Promise<KaleTransactionResult> {
    try {
      if (!connector.isConnected()) {
        throw new Error('Wallet not connected');
      }

      const publicKey = connector.getPublicKey();
      if (!publicKey) {
        throw new Error('No public key available');
      }

      // Get account details
      const accountRecord = await this.server.accounts().accountId(publicKey).call();
      const account = new Account(accountRecord.account_id, accountRecord.sequence);

      // Create contract instance
      const contract = new Contract(this.contractId);

      let transaction = new TransactionBuilder(account, {
        fee: '100',
        networkPassphrase: this.network === 'mainnet' ? Networks.PUBLIC : Networks.TESTNET
      })
        .addOperation(contract.call('harvest'))
        .setTimeout(30)
        .build();

      // Simulate transaction
      const simulation = await this.rpc.simulateTransaction(transaction);
      if (SorobanRpc.Api.isSimulationError(simulation)) {
        throw new Error(`Simulation failed: ${simulation.error}`);
      }

      // Assemble the transaction with the simulation result
      transaction = SorobanRpc.assembleTransaction(transaction, simulation)

        .build();

      // Sign the transaction
      const signedResult = await connector.signTransaction(transaction.toXDR());

      // Submit the transaction
      const signedTransaction = TransactionBuilder.fromXDR(signedResult.signedXDR, this.network === 'mainnet' ? Networks.PUBLIC : Networks.TESTNET);
      const submitResult = await this.rpc.sendTransaction(signedTransaction);

      if (submitResult.status !== 'PENDING') {
        throw new Error(`Transaction failed: ${submitResult.status}`);
      }

      // Wait for confirmation
      let status: any = submitResult.status;
      let attempts = 0;
      while (status === 'PENDING' && attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const response = await this.rpc.getTransaction(submitResult.hash);
        status = response.status;
        attempts++;
      }

      if (status !== 'SUCCESS') {
        throw new Error(`Transaction failed with status: ${status}`);
      }

      return {
        success: true,
        transactionHash: submitResult.hash
      };

    } catch (error) {
      console.error('Harvest transaction failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get current farming status for an address
   */
  async getFarmStatus(address: string): Promise<KaleFarmStatus> {
    try {
      const contract = new Contract(this.contractId);
      const addressScVal = new Address(address).toScVal();

      // Call the contract to get farming status
      // This is a simplified implementation - in reality you'd need to call
      // specific contract methods to get this data
      const currentLedger = await this.server.ledgers().order('desc').limit(1).call();

      return {
        isActive: false, // This would come from contract call
        stakeAmount: '0',
        plantLedger: 0,
        currentLedger: currentLedger.records[0].sequence,
        gap: 0,
        pendingRewards: '0'
      };
    } catch (error) {
      console.error('Failed to get farm status:', error);
      throw error;
    }
  }

  /**
   * Calculate gap between plant and current ledger
   */
  calculateGap(plantLedger: number, currentLedger: number): number {
    return Math.max(0, currentLedger - plantLedger);
  }

  /**
   * Estimate rewards based on KALE formula
   * This is a simplified estimation based on the KALE model
   */
  estimateReward(stake: number, gap: number, zeros: number): KaleRewardEstimate {
    // Simplified KALE reward calculation
    // In reality, this would follow the exact formula from the KALE contract
    const baseReward = stake * Math.log(gap + 1) * (zeros + 1);
    const probability = Math.min(0.95, 1 / Math.pow(2, zeros));

    return {
      stake,
      gap,
      zeros,
      estimatedReward: baseReward * probability,
      probability
    };
  }

  /**
   * Count leading zeros in a hash
   */
  countLeadingZeros(hash: string): number {
    let zeros = 0;
    for (let i = 0; i < hash.length; i += 2) {
      const byte = parseInt(hash.substr(i, 2), 16);
      if (byte === 0) {
        zeros += 8;
      } else {
        zeros += Math.clz32(byte) - 24; // Count leading zeros in byte
        break;
      }
    }
    return zeros;
  }
}
