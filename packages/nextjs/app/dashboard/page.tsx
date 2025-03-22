"use client";

import React from "react";
import { EnergyAccountCard } from "../../components/EnergyAccountCard";
import { BuySellCard } from "~~/components/BuySellCard";
import { EnergyChart } from "~~/components/EnergyChart";
import { MarketPriceChart, getCurrentMarketPrice } from "~~/components/MarketPriceChart";
import { WeatherCard } from "~~/components/WeatherCard";

export default function DashboardPage() {
  // Get the current market price
  const currentPrice = getCurrentMarketPrice();

  return (
    <main className="h-full flex flex-col gap-4 p-6 bg-gray-50">
      {/* Market Price Highlight Box - Moved to top */}
      <div className="w-full flex justify-center mb-1">
        <div className="bg-green-100 rounded-lg px-6 py-2 shadow-md border border-green-300">
          <p className="text-xl font-semibold text-green-800">Market Price: ${currentPrice.toFixed(3)}/kWh</p>
        </div>
      </div>

      {/* Dashboard Grid Layout */}
      <div className="grid grid-cols-3 grid-rows-2 gap-4 flex-grow">
        {/* Top Row: Energy Account Card */}
        <div className="bg-white rounded-lg p-4 shadow">
          <EnergyAccountCard />
        </div>

        {/* Top Row: Market Price Chart */}
        <div className="bg-white rounded-lg p-4 shadow">
          <MarketPriceChart />
        </div>

        {/* Top Row: Buy/Sell Card */}
        <div className="bg-white rounded-lg p-4 shadow flex justify-center items-center">
          <BuySellCard />
        </div>

        {/* Bottom Row: Energy Chart */}
        <div className="bg-white rounded-lg p-4 shadow col-span-2">
          <EnergyChart />
        </div>

        {/* Bottom Row: Weather Card */}
        <div className="h-full">
          <WeatherCard />
        </div>
      </div>
    </main>
  );
}
