// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EnergyMarket is Ownable {
    IERC20 public nzddToken;
    mapping(address => uint256) public userEnergyBalance;
    uint256 public pricePerEnergyUnit = 1 ether; // 1 NZDD per energy unit

    event EnergySold(address indexed seller, uint256 amount, uint256 payment);
    event EnergyGenerated(address indexed user, uint256 amount);

    constructor(address _nzddToken) Ownable(msg.sender) {
        nzddToken = IERC20(_nzddToken);
    }

    // Simulates energy generation - in a real app, this would be reported by IoT devices
    function generateEnergy(uint256 amount) external {
        userEnergyBalance[msg.sender] += amount;
        emit EnergyGenerated(msg.sender, amount);
    }

    function sellEnergy(uint256 energyAmount) external {
        require(userEnergyBalance[msg.sender] >= energyAmount, "Not enough energy balance");
        
        uint256 payment = energyAmount * pricePerEnergyUnit / 1 ether;
        
        // Reduce user's energy balance
        userEnergyBalance[msg.sender] -= energyAmount;
        
        // Pay the seller with NZDD (from the contract's balance)
        require(nzddToken.transfer(msg.sender, payment), "Payment failed");
        
        emit EnergySold(msg.sender, energyAmount, payment);
    }

    // Admin function to set price
    function setEnergyPrice(uint256 newPrice) external onlyOwner {
        pricePerEnergyUnit = newPrice;
    }

    // Admin function to load NZDD into the contract
    function fundContract(uint256 amount) external onlyOwner {
        require(nzddToken.transferFrom(msg.sender, address(this), amount), "Funding failed");
    }

    // Get user's current energy balance
    function getUserEnergyBalance(address user) external view returns (uint256) {
        return userEnergyBalance[user];
    }
} 