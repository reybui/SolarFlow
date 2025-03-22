import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployEnergyMarket: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // First deploy the NZDD token
  const nzddToken = await deploy("MockNZDD", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  // Then deploy the energy market
  await deploy("EnergyMarket", {
    from: deployer,
    args: [nzddToken.address],
    log: true,
    autoMine: true,
  });
};

export default deployEnergyMarket;
deployEnergyMarket.tags = ["EnergyMarket", "MockNZDD"];
