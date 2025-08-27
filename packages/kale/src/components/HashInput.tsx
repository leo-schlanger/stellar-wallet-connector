import React, { useState } from 'react';
import { countLeadingZeros, simulateProofOfWork } from '../helpers';

interface HashInputProps {
  onWork: (hash: string) => Promise<void>;
  disabled?: boolean;
}

export function HashInput({ onWork, disabled = false }: HashInputProps) {
  const [hash, setHash] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [targetZeros, setTargetZeros] = useState(4);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hash || disabled || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onWork(hash);
      setHash('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateProofOfWork = async () => {
    setIsGenerating(true);
    try {
      // Use a mock address for simulation - in real usage this would come from the wallet
      const mockAddress = 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
      const mockLedger = Date.now();

      const result = simulateProofOfWork(mockAddress, mockLedger, targetZeros, 1000000);
      setHash(result.hash);
    } catch (error) {
      console.error('Failed to generate proof-of-work:', error);
      // Fallback to a simple hash
      setHash(Date.now().toString(16));
    } finally {
      setIsGenerating(false);
    }
  };

  const zeros = hash ? countLeadingZeros(hash) : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
        ⚡ Submit Proof-of-Work
      </h3>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <label htmlFor="workHash" className="block text-sm font-medium text-gray-700 mb-1">
            Work Hash
          </label>
          <input
            id="workHash"
            type="text"
            value={hash}
            onChange={(e) => setHash(e.target.value)}
            placeholder="Enter proof-of-work hash..."
            disabled={disabled || isSubmitting}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed font-mono text-xs sm:text-sm"
            required
          />
        </div>

        {hash && (
          <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 text-xs sm:text-sm">Leading Zeros:</span>
              <span className="font-mono font-semibold text-blue-600 text-sm">{zeros}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-600 text-xs sm:text-sm">Hash:</span>
              <span className="font-mono text-xs text-gray-500 truncate ml-2">{hash}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
          <div className="flex-1">
            <label htmlFor="targetZeros" className="block text-sm font-medium text-gray-700 mb-1">
              Target Zeros
            </label>
            <select
              id="targetZeros"
              value={targetZeros}
              onChange={(e) => setTargetZeros(parseInt(e.target.value))}
              disabled={disabled || isGenerating}
              className="w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>{num} zeros</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={generateProofOfWork}
              disabled={disabled || isGenerating}
              className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isGenerating ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                  Mining...
                </div>
              ) : (
                'Generate'
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={!hash || disabled || isSubmitting}
          className="w-full bg-blue-600 text-white py-2 sm:py-3 px-4 text-sm sm:text-base rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting...
            </div>
          ) : (
            'Submit Work'
          )}
        </button>
      </form>

      <div className="mt-4 text-sm text-gray-600">
        <p>💡 <strong>Tip:</strong> More leading zeros increase your chances of better rewards. Use the generator to find valid proof-of-work.</p>
      </div>
    </div>
  );
}
