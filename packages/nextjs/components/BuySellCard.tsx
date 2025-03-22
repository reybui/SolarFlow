import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useEnergy } from "~~/contexts/EnergyContext";
import { useEnergyMarket } from "~~/hooks/useEnergyMarket";
import { notification } from "~~/utils/scaffold-eth";

export const BuySellCard: React.FC = () => {
  const [energyAmount, setEnergyAmount] = useState<string>("");
  const { address, isConnected } = useAccount();
  const { energy, targetEnergy, setTargetEnergy } = useEnergy();
  const { buyEnergy, sellEnergy, marketPrice, isGenerating, isSelling, transactionInProgress } = useEnergyMarket();

  const parsedAmount = parseFloat(energyAmount) || 0;
  const paymentAmount = parsedAmount * marketPrice;

  const handleBuy = () => {
    if (!isConnected) {
      notification.error("Please connect your wallet first");
      return;
    }
    if (parsedAmount <= 0) {
      notification.error("Please enter a valid amount");
      return;
    }

    // Pass the amount to buy - the market price is handled in the hook
    buyEnergy(parsedAmount);
  };

  const handleSell = () => {
    if (!isConnected) {
      notification.error("Please connect your wallet first");
      return;
    }
    if (parsedAmount > energy) {
      notification.error("You don't have enough energy to sell");
      return;
    }

    // Call the hook function to handle the selling
    // Remove the manual update here because it's now handled in the hook
    sellEnergy(parsedAmount);

    // Just clear the input
    setEnergyAmount("");
  };

  // Listen for transaction in progress changes to clear the input
  useEffect(() => {
    if (!transactionInProgress) {
      setEnergyAmount("");
    }
  }, [transactionInProgress]);

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center space-y-3 w-56">
      <div className="text-center w-full">
        {/* <p className="text-xs font-medium text-gray-700">Your Energy Balance: {Math.round(energy * 100) / 100} kWh</p> */}
      </div>

      <div className="w-full text-center">
        <label className="block text-xs font-medium text-gray-700 mb-1">Amount to Buy/Sell (kWh)</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={energyAmount}
          onChange={e => setEnergyAmount(e.target.value)}
          className="w-full p-1.5 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100 text-gray-900"
          placeholder="Enter amount"
        />
      </div>

      <div className="text-sm text-gray-700">Current Price: ${marketPrice.toFixed(3)}/kWh</div>
      <div className="text-sm font-semibold text-gray-900">
        Total Value: ${paymentAmount.toFixed(3)}
        {transactionInProgress && <span className="ml-2 text-xs text-blue-500">(Processing...)</span>}
      </div>

      <button
        onClick={handleBuy}
        disabled={isGenerating || transactionInProgress}
        className="btn btn-sm w-full font-medium bg-emerald-500 hover:bg-emerald-600 border-none text-white h-8 min-h-0 disabled:bg-emerald-400"
      >
        {isGenerating ? "Buying..." : transactionInProgress ? "Processing..." : "Buy Energy"}
      </button>

      <button
        onClick={handleSell}
        disabled={isSelling || parsedAmount > energy || transactionInProgress}
        className="btn btn-sm w-full font-medium bg-red-500 hover:bg-red-600 border-none text-white h-8 min-h-0 disabled:bg-red-400"
      >
        {isSelling ? "Selling..." : "Sell Energy"}
      </button>

      {!isConnected && <p className="text-center text-red-500 text-xs">Connect wallet to trade energy</p>}
    </div>
  );
};
