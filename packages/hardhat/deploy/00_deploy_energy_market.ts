import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployEnergyMarket: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Use the real NZDD token address on Sepolia
  // This should be the contract address of your NZDD token (the one with 6 decimals)
  const nzddTokenAddress = "0xE91d143072fc5e92e6445f18aa35DBd43597340c"; // Replace with your actual token contract address on Sepolia

  // Deploy the energy market with the real NZDD token address
  await deploy("EnergyMarket", {
    from: deployer,
    args: [nzddTokenAddress],
    log: true,
    autoMine: true,
  });
};

export default deployEnergyMarket;
deployEnergyMarket.tags = ["EnergyMarket"];
