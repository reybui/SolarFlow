"use client";

import React from "react";
import { EnergyAccountCard } from "../../components/EnergyAccountCard";
import { BuySellCard } from "~~/components/BuySellCard";
import { EnergyChart } from "~~/components/EnergyChart";
import { MarketPriceChart } from "~~/components/MarketPriceChart";
import { WeatherCard } from "~~/components/WeatherCard";
import { EnergyProvider } from "~~/contexts/EnergyContext";

export default function DashboardPage() {
  return (
    <EnergyProvider>
      <main className="h-full flex flex-col gap-4 p-6 bg-gray-50">
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
    </EnergyProvider>
  );
}
