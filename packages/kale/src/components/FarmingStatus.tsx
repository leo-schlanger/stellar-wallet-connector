import React from 'react';
import { KaleFarmStatus } from '../types';

interface FarmingStatusProps {
  status: KaleFarmStatus | null;
  isLoading?: boolean;
}

export function FarmingStatus({ status, isLoading }: FarmingStatusProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
          🌾 Farming Status
        </h3>
        <div className="flex items-center justify-center py-6 sm:py-8">
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
          🌾 Farming Status
        </h3>
        <div className="text-center py-6 sm:py-8 text-gray-500">
          <p className="text-sm sm:text-base">No farming data available</p>
          <p className="text-xs sm:text-sm mt-2">Stake some KALE to start farming!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
        🌾 Farming Status
      </h3>

      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-sm">Status:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            status.isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {status.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-sm">Staked Amount:</span>
          <span className="font-mono font-semibold text-green-600 text-sm">
            {status.stakeAmount} KALE
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-sm">Current Ledger:</span>
          <span className="font-mono text-xs sm:text-sm text-gray-900">
            #{status.currentLedger.toLocaleString()}
          </span>
        </div>

        {status.plantLedger > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm">Plant Ledger:</span>
            <span className="font-mono text-xs sm:text-sm text-gray-900">
              #{status.plantLedger.toLocaleString()}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-sm">Gap:</span>
          <span className="font-mono font-semibold text-blue-600 text-sm">
            {status.gap.toLocaleString()} ledgers
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-sm">Pending Rewards:</span>
          <span className="font-mono font-semibold text-purple-600 text-sm">
            {status.pendingRewards} KALE
          </span>
        </div>

        {status.lastWorkHash && (
          <div className="border-t pt-3 sm:pt-4">
            <h4 className="font-medium text-gray-900 mb-2 text-sm">Last Work</h4>
            <div className="bg-gray-50 rounded p-2 sm:p-3">
              <div className="font-mono text-xs text-gray-600 break-all">
                {status.lastWorkHash}
              </div>
              {status.lastWorkLedger && (
                <div className="text-xs text-gray-500 mt-1">
                  Ledger #{status.lastWorkLedger.toLocaleString()}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {status.isActive && status.pendingRewards !== '0' && (
        <div className="mt-3 sm:mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <div className="text-green-500 mr-2 text-lg">🎉</div>
            <div className="text-sm">
              <span className="font-medium text-green-800">Rewards Available!</span>
              <br />
              <span className="text-green-700">Harvest your {status.pendingRewards} KALE</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
