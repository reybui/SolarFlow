"use client";

import React, { useEffect, useState } from "react";
import { MarketPriceChart } from "./MarketPriceChart";

export const EnergyAccountCard: React.FC = () => {
  const [energy, setEnergy] = useState(0); // Start at 0 for animation
  const targetEnergy = 50; // Final value on page load
  const maxEnergy = 100;
  const costPerKWh = 0.32;

  // Animate fill on mount
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setEnergy(prev => (current <= targetEnergy ? current : prev));
      if (current >= targetEnergy) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full p-6 rounded-lg flex flex-col gap-4">
      {/* Title */}
      <h2 className="text-xl font-bold text-gray-800">Energy Account</h2>

      {/* Battery Row */}
      <div className="flex justify-between items-center gap-6">
        {/* Battery + Balance */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center">
            <div className="w-6 h-2 bg-gray-700 rounded-sm mb-1" />
            <div className="relative w-12 h-40 bg-white border-4 border-gray-500 rounded-md overflow-hidden">
              <div
                className="absolute bottom-0 left-0 w-full bg-green-500 transition-all duration-500 rounded-t-md"
                style={{ height: `${(energy / maxEnergy) * 100}%` }}
              />
            </div>
          </div>

          {/* Balance */}
          <div className="text-sm text-gray-600">
            Balance: <span className="font-medium">{energy} kWh</span>
          </div>
        </div>
      </div>
    </div>
  );
};
