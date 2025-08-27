import React, { useState } from 'react';
import { KaleService } from '../kale-service';
import { KaleRewardEstimate } from '../types';
import { calculateOptimalWork, calculateExpectedValue } from '../helpers';

interface RewardPredictorProps {
  kaleService: KaleService;
}

export function RewardPredictor({ kaleService }: RewardPredictorProps) {
  const [stake, setStake] = useState('');
  const [gap, setGap] = useState('');
  const [zeros, setZeros] = useState('');
  const [estimate, setEstimate] = useState<KaleRewardEstimate | null>(null);

  const calculateEstimate = () => {
    const stakeNum = parseFloat(stake);
    const gapNum = parseInt(gap);
    const zerosNum = parseInt(zeros);

    if (!stakeNum || !gapNum || !zerosNum) return;

    const result = kaleService.estimateReward(stakeNum, gapNum, zerosNum);
    setEstimate(result);
  };

  const optimalWork = stake && gap
    ? calculateOptimalWork(parseFloat(stake), parseInt(gap))
    : null;

  const expectedValue = estimate
    ? calculateExpectedValue(estimate.stake, estimate.gap, estimate.zeros, 100000)
    : null;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
        🔮 Reward Predictor
      </h3>

      <div className="space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stake
            </label>
            <input
              type="number"
              step="0.0000001"
              min="0"
              value={stake}
              onChange={(e) => setStake(e.target.value)}
              placeholder="0.0"
              className="w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gap
            </label>
            <input
              type="number"
              min="0"
              value={gap}
              onChange={(e) => setGap(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zeros
            </label>
            <input
              type="number"
              min="0"
              value={zeros}
              onChange={(e) => setZeros(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          onClick={calculateEstimate}
          disabled={!stake || !gap || !zeros}
          className="w-full bg-indigo-600 text-white py-2 px-4 text-sm sm:text-base rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Calculate Reward
        </button>

        {estimate && (
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-3">
            <h4 className="font-medium text-gray-900 text-sm sm:text-base">Reward Estimate</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 text-xs sm:text-sm">Estimated Reward:</span>
                <div className="font-mono font-semibold text-green-600 text-sm sm:text-base">
                  {estimate.estimatedReward.toFixed(7)} KALE
                </div>
              </div>

              <div>
                <span className="text-gray-600 text-xs sm:text-sm">Probability:</span>
                <div className="font-mono font-semibold text-blue-600 text-sm sm:text-base">
                  {(estimate.probability * 100).toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        )}

        {optimalWork && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="font-medium text-blue-900 mb-2 text-sm sm:text-base">💡 Optimal Strategy</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <div className="text-xs sm:text-sm">Recommended zeros: <strong>{optimalWork.recommendedZeros}</strong></div>
              <div className="text-xs sm:text-sm">Estimated time: <strong>{optimalWork.estimatedTime.toFixed(1)}s</strong></div>
              <div className="text-xs sm:text-sm">Difficulty: <strong>{optimalWork.difficulty.toLocaleString()}</strong></div>
            </div>
          </div>
        )}

        {expectedValue && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <h4 className="font-medium text-green-900 mb-2 text-sm sm:text-base">📊 Expected Value</h4>
            <div className="text-sm text-green-800 space-y-1">
              <div className="text-xs sm:text-sm">Expected reward: <strong>{expectedValue.expectedReward.toFixed(7)} KALE</strong></div>
              <div className="text-xs sm:text-sm">Expected cost: <strong>{expectedValue.expectedCost.toFixed(7)} XLM</strong></div>
              <div className={`text-xs sm:text-sm ${expectedValue.profit > 0 ? 'text-green-700' : 'text-red-700'}`}>
                Net profit: <strong>{expectedValue.profit.toFixed(7)} XLM</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
