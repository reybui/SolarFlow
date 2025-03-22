import React, { useState } from "react";

export const BuySellCard: React.FC = () => {
  const [buyAmount, setBuyAmount] = useState<string>("");
  const [sellAmount, setSellAmount] = useState<string>("");

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center space-y-3 w-56">
      <div className="w-full text-center">
        <label htmlFor="buyAmount" className="block text-xs font-medium text-gray-700 mb-1">
          Amount to Buy (kWh)
        </label>
        <input
          id="buyAmount"
          type="number"
          min="0"
          step="0.01"
          value={buyAmount}
          onChange={e => setBuyAmount(e.target.value)}
          className="w-full p-1.5 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 mb-1.5 bg-gray-100 text-gray-900"
          placeholder="Enter amount"
        />
        <button className="btn btn-sm w-full font-medium bg-emerald-500 hover:bg-emerald-600 border-none text-white h-8 min-h-0">
          Buy Energy
        </button>
      </div>

      <div className="w-full border-t border-gray-200 my-1.5 pt-3"></div>

      <div className="w-full text-center">
        <label htmlFor="sellAmount" className="block text-xs font-medium text-gray-700 mb-1">
          Amount to Sell (kWh)
        </label>
        <input
          id="sellAmount"
          type="number"
          min="0"
          step="0.01"
          value={sellAmount}
          onChange={e => setSellAmount(e.target.value)}
          className="w-full p-1.5 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 mb-1.5 bg-gray-100 text-gray-900"
          placeholder="Enter amount"
        />
        <button className="btn btn-sm w-full font-medium bg-emerald-500 hover:bg-emerald-600 border-none text-white h-8 min-h-0">
          Sell Energy
        </button>
      </div>
    </div>
  );
};
