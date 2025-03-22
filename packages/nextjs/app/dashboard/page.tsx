"use client";

import { useCallback, useEffect, useState } from "react";
import { formatEther, parseEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function Dashboard() {
  const { address } = useAccount();
  const [energyAmount, setEnergyAmount] = useState("");
  const [loadingGenerate, setLoadingGenerate] = useState(false);

  // Read user's energy balance from contract
  const { data: userEnergyBalance, refetch: refetchBalance } = useScaffoldReadContract({
    contractName: "EnergyMarket",
    functionName: "getUserEnergyBalance",
    args: [address || "0x0000000000000000000000000000000000000000"],
  });

  // Format energy balance for display
  const excessEnergy = userEnergyBalance ? parseFloat(formatEther(userEnergyBalance)) : 0;
  // Hook to sell energy
  const { writeContractAsync: sellEnergy } = useScaffoldWriteContract({
    contractName: "EnergyMarket",
  });

  // Hook to generate energy (for demo purposes)
  const { writeContractAsync: generateEnergy } = useScaffoldWriteContract({
    contractName: "EnergyMarket",
  });

  // Declare handleGenerateEnergy before useEffect
  const handleGenerateEnergy = useCallback(async () => {
    setLoadingGenerate(true);
    try {
      await generateEnergy({
        functionName: "generateEnergy",
        args: [parseEther("10")],
      });
      setLoadingGenerate(false);
      refetchBalance();
    } catch (error) {
      console.error("Error generating energy:", error);
      setLoadingGenerate(false);
    }
  }, [generateEnergy, refetchBalance]); // Include all dependencies used in the function

  useEffect(() => {
    if (address && excessEnergy === 0) {
      handleGenerateEnergy();
    }
  }, [address]);

  const handleSell = async () => {
    if (!energyAmount || parseFloat(energyAmount) <= 0) {
      alert("Please enter a valid energy amount");
      return;
    }

    if (parseFloat(energyAmount) > excessEnergy) {
      alert("You cannot sell more energy than you have available");
      return;
    }
    try {
      await sellEnergy({
        functionName: "sellEnergy",
        args: [energyAmount ? parseEther(energyAmount) : 0n],
      });
      setEnergyAmount("");
      refetchBalance(); // Re-fetch balance after successful sale
    } catch (error) {
      console.error("Error selling energy:", error);
      alert("Transaction failed. Please check console for details.");
    }
  };

  return (
    <div className="flex flex-col py-8 px-4 gap-6">
      <h1 className="text-4xl font-bold">Energy Dashboard</h1>

      <div className="bg-base-200 p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Your Energy Status</h2>

        <div className="stats bg-primary text-primary-content shadow mb-6">
          <div className="stat">
            <div className="stat-title">Excess Energy Available</div>
            <div className="stat-value">{excessEnergy.toFixed(2)} kWh</div>
            <div className="stat-desc">Energy you can sell</div>
          </div>
        </div>

        <div className="divider">Sell Your Excess Energy</div>

        <div className="form-control w-full max-w-md mx-auto">
          <label className="label">
            <span className="label-text">Amount to sell (kWh)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Enter amount"
              className="input input-bordered w-full"
              value={energyAmount}
              onChange={e => setEnergyAmount(e.target.value)}
              max={excessEnergy}
            />
            <button
              className={`btn btn-primary ${loadingGenerate ? "loading" : ""}`}
              onClick={handleSell}
              disabled={loadingGenerate || !energyAmount}
            >
              Sell
            </button>
          </div>
          <label className="label">
            <span className="label-text-alt">
              You will receive {energyAmount ? parseFloat(energyAmount).toFixed(2) : 0} NZDD
            </span>
          </label>
        </div>

        {/* For demo purposes, add a button to generate energy */}
        <div className="mt-6 flex justify-center">
          <button
            className={`btn btn-secondary ${loadingGenerate ? "loading" : ""}`}
            onClick={handleGenerateEnergy}
            disabled={loadingGenerate}
          >
            Generate 10 kWh (Demo)
          </button>
        </div>
      </div>

      <div className="bg-base-200 p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Connected Wallet</h2>
        <p className="font-mono">{address || "Not connected"}</p>
      </div>
    </div>
  );
}
