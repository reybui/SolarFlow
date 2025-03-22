import { useEffect, useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { getCurrentMarketPrice } from "~~/components/MarketPriceChart";
import { useEnergy } from "~~/contexts/EnergyContext";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

// NZDD token ABI - just the functions we need
const nzddAbi = [
  {
    type: "function",
    name: "approve",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
  },
] as const;

export const useEnergyMarket = () => {
  const { address } = useAccount();
  const [energyBalance, setEnergyBalance] = useState<bigint>(BigInt(0));
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isSelling, setIsSelling] = useState<boolean>(false);
  const [transactionInProgress, setTransactionInProgress] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const { data: energyMarketData } = useDeployedContractInfo("EnergyMarket");

  // Read user's energy balance
  const { data: balanceData, refetch: refetchBalance } = useScaffoldReadContract({
    contractName: "EnergyMarket",
    functionName: "getUserEnergyBalance",
    args: [address],
  });

  // Generate energy (simulate production)
  const { writeContractAsync: generateEnergyTx, isMining: isGeneratingEnergy } = useScaffoldWriteContract({
    contractName: "EnergyMarket",
  });

  // Sell energy
  const { writeContractAsync: sellEnergyTx, isMining: isSellingEnergy } = useScaffoldWriteContract({
    contractName: "EnergyMarket",
  });

  // Buy energy
  const { writeContractAsync: buyEnergyTx, isMining: isBuyingEnergy } = useScaffoldWriteContract({
    contractName: "EnergyMarket",
  });

  // Direct NZDD approve function using wagmi (not scaffold-eth)
  const { writeContractAsync: approveNZDDDirect } = useWriteContract();

  const { setTargetEnergy, energy } = useEnergy();

  // Update states when data changes
  useEffect(() => {
    if (balanceData) {
      setEnergyBalance(BigInt(balanceData.toString()));
    }
  }, [balanceData]);

  // Update mining states
  useEffect(() => {
    setIsGenerating(isBuyingEnergy); // rename to setIsBuying if desired
    setIsSelling(isSellingEnergy);
  }, [isBuyingEnergy, isSellingEnergy]);

  const handleGenerateEnergy = async (amount: number) => {
    try {
      setIsGenerating(true);
      await generateEnergyTx({
        functionName: "generateEnergy",
        args: [BigInt(amount)],
      });
      notification.success(`Generated ${amount} kWh of energy!`);
      refetchBalance();
    } catch (error) {
      console.error("Error generating energy:", error);
      notification.error("Failed to generate energy");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSellEnergy = async (amount: number) => {
    try {
      setIsSelling(true);
      await sellEnergyTx({
        functionName: "sellEnergy",
        args: [BigInt(amount)],
      });
      notification.success(`Sold ${amount} kWh of energy!`);

      // Update the contract's energy balance
      refetchBalance();

      // Update the UI energy balance directly with a fixed number, not a function
      setTargetEnergy(energy - amount); // This is correct, using direct numbers not a function
    } catch (error) {
      console.error("Error selling energy:", error);
      notification.error("Failed to sell energy");
    } finally {
      setIsSelling(false);
    }
  };

  const handleApproveNZDD = async (amount: number) => {
    try {
      if (!energyMarketData?.address) {
        notification.error("EnergyMarket contract address not found");
        return;
      }

      setIsApproving(true);

      // Calculate the exact cost with precise decimal handling
      const currentMarketPrice = getCurrentMarketPrice();

      // Multiply by 1e6 first before rounding to avoid floating point issues
      // This converts to the smallest NZDD unit (millionths)
      const costInTokenUnits = Math.floor(amount * currentMarketPrice * 1e6);

      // Convert to BigInt after all floating point operations are done
      const approvalAmount = BigInt(costInTokenUnits);

      console.log(`Approving ${amount} kWh at $${currentMarketPrice}/kWh = ${costInTokenUnits} token units`);

      // Use direct approach with wagmi's useWriteContract
      await approveNZDDDirect({
        address: "0xE91d143072fc5e92e6445f18aa35DBd43597340c", // NZDD token address
        abi: nzddAbi,
        functionName: "approve",
        args: [energyMarketData.address, approvalAmount],
      });

      notification.success(`Approved ${(amount * currentMarketPrice).toFixed(6)} NZDD tokens for energy purchase`);
    } catch (error) {
      console.error("Error approving NZDD:", error);
      notification.error("Failed to approve NZDD");
    } finally {
      setIsApproving(false);
    }
  };

  const handleBuyEnergy = async (amount: number) => {
    try {
      // Prevent multiple concurrent transactions
      if (transactionInProgress || isGenerating || isApproving) {
        notification.warning("Transaction already in progress");
        return;
      }

      setTransactionInProgress(true);
      const currentMarketPrice = getCurrentMarketPrice();

      // First approve with the exact amount
      try {
        const exactCost = amount * currentMarketPrice;
        await handleApproveNZDD(amount);
        console.log(`Approving for purchase: ${amount} kWh at $${currentMarketPrice}/kWh = $${exactCost.toFixed(6)}`);
      } catch (error) {
        console.error("Error during approval:", error);
        setTransactionInProgress(false);
        return; // Exit if approval fails
      }

      // Then buy - make sure to wait for approval to complete
      setIsGenerating(true);
      await buyEnergyTx({
        functionName: "buyEnergy",
        args: [BigInt(amount)],
      });
      notification.success(`Bought ${amount} kWh of energy for $${(amount * currentMarketPrice).toFixed(3)}!`);

      // Update the UI to reflect the new balance
      refetchBalance();

      // Direct number assignment to fix TypeScript error - using the current energy plus new amount
      setTargetEnergy(energy + amount); // Pass a direct number, not a function
    } catch (error) {
      console.error("Error buying energy:", error);
      notification.error("Failed to buy energy");
    } finally {
      setIsGenerating(false);
      setTransactionInProgress(false);
    }
  };

  return {
    energyBalance,
    marketPrice: getCurrentMarketPrice(), // Use the chart's market price function
    generateEnergy: handleGenerateEnergy,
    sellEnergy: handleSellEnergy,
    buyEnergy: handleBuyEnergy,
    isGenerating,
    isSelling,
    refetchBalance,
    isApproving,
    transactionInProgress,
  };
};
