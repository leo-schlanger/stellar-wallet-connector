import React, { useState } from 'react';

interface HarvestButtonProps {
  onHarvest: () => Promise<void>;
  disabled?: boolean;
}

export function HarvestButton({ onHarvest, disabled = false }: HarvestButtonProps) {
  const [isHarvesting, setIsHarvesting] = useState(false);

  const handleHarvest = async () => {
    setIsHarvesting(true);
    try {
      await onHarvest();
    } finally {
      setIsHarvesting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
        🌾 Harvest Rewards
      </h3>

      <div className="space-y-3 sm:space-y-4">
        <div className="text-center">
          <div className="text-3xl sm:text-4xl mb-2">🌽</div>
          <p className="text-gray-600 text-sm">
            Claim your farming rewards
          </p>
        </div>

        <button
          onClick={handleHarvest}
          disabled={disabled || isHarvesting}
          className="w-full bg-purple-600 text-white py-2 sm:py-3 px-4 text-sm sm:text-base rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isHarvesting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Harvesting...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <span className="mr-2">🌾</span>
              Harvest Rewards
            </div>
          )}
        </button>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>💡 <strong>Tip:</strong> Harvest your rewards regularly to maximize your farming efficiency!</p>
      </div>
    </div>
  );
}
