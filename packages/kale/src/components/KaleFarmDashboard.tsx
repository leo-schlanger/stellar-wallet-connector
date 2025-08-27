import React, { useState, useEffect } from 'react';
import { StellarWalletConnector } from '@stellar-wallet-connector/core';
import { KaleService } from '../kale-service';
import { KaleFarmStatus } from '../types';
import { StakeInput } from './StakeInput';
import { HashInput } from './HashInput';
import { FarmingStatus } from './FarmingStatus';
import { HarvestButton } from './HarvestButton';
import { RewardPredictor } from './RewardPredictor';

interface KaleFarmDashboardProps {
  connector: StellarWalletConnector;
  network?: 'testnet' | 'mainnet';
}

export function KaleFarmDashboard({ connector, network = 'testnet' }: KaleFarmDashboardProps) {
  const [kaleService] = useState(() => new KaleService({ network }));
  const [farmStatus, setFarmStatus] = useState<KaleFarmStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const publicKey = connector.getPublicKey();

  useEffect(() => {
    if (publicKey) {
      loadFarmStatus();
    }
  }, [publicKey]);

  const loadFarmStatus = async () => {
    if (!publicKey) return;

    setIsLoading(true);
    setError(null);

    try {
      const status = await kaleService.getFarmStatus(publicKey);
      setFarmStatus(status);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load farm status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStake = async (amount: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await kaleService.plant(amount, connector);
      if (result.success) {
        setSuccess(`Successfully staked ${amount} KALE! Transaction: ${result.transactionHash}`);
        await loadFarmStatus();
      } else {
        setError(result.error || 'Staking failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Staking failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWork = async (hash: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await kaleService.work(hash, connector);
      if (result.success) {
        setSuccess(`Proof-of-work submitted! Transaction: ${result.transactionHash}`);
        await loadFarmStatus();
      } else {
        setError(result.error || 'Work submission failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Work submission failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHarvest = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await kaleService.harvest(connector);
      if (result.success) {
        setSuccess(`Rewards harvested! Transaction: ${result.transactionHash}`);
        await loadFarmStatus();
      } else {
        setError(result.error || 'Harvest failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Harvest failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!connector.isConnected()) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
          Connect Your Wallet
        </h3>
        <p className="text-yellow-700">
          Please connect your Stellar wallet to start farming KALE
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          🌱 KALE Farming Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-600 px-2">
          Stake KALE, submit proof-of-work, and harvest rewards
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-500 mr-3">⚠️</div>
            <div>
              <h3 className="font-semibold text-red-800">Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-green-500 mr-3">✅</div>
            <div>
              <h3 className="font-semibold text-green-800">Success</h3>
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-3"></div>
            <p className="text-blue-700">Processing transaction...</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-4">
          <StakeInput onStake={handleStake} disabled={isLoading} />
          <HashInput onWork={handleWork} disabled={isLoading} />
          <HarvestButton onHarvest={handleHarvest} disabled={isLoading} />
        </div>

        <div className="space-y-4">
          <FarmingStatus status={farmStatus} isLoading={isLoading} />
          <RewardPredictor kaleService={kaleService} />
        </div>
      </div>
    </div>
  );
}
