import React, { useState } from 'react';

interface StakeInputProps {
  onStake: (amount: string) => Promise<void>;
  disabled?: boolean;
}

export function StakeInput({ onStake, disabled = false }: StakeInputProps) {
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || disabled || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onStake(amount);
      setAmount('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
        🌱 Stake KALE
      </h3>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <label htmlFor="stakeAmount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount to Stake
          </label>
          <div className="relative">
            <input
              id="stakeAmount"
              type="number"
              step="0.0000001"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0000000"
              disabled={disabled || isSubmitting}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <span className="text-gray-500 text-xs sm:text-sm">KALE</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!amount || disabled || isSubmitting}
          className="w-full bg-green-600 text-white py-2 sm:py-3 px-4 text-sm sm:text-base rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Staking...
            </div>
          ) : (
            'Stake KALE'
          )}
        </button>
      </form>

      <div className="mt-4 text-sm text-gray-600">
        <p>💡 <strong>Tip:</strong> Larger stakes have higher potential rewards, but also require more work to harvest.</p>
      </div>
    </div>
  );
}
