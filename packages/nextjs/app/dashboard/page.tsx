"use client";

import React from "react";
import { EnergyAccountCard } from "../../components/EnergyAccountCard";
import { BuySellCard } from "~~/components/BuySellCard";
import { EnergyChart } from "~~/components/EnergyChart";
import { MarketPriceChart } from "~~/components/MarketPriceChart";
import { WeatherCard } from "~~/components/WeatherCard";

export default function DashboardPage() {
  return (
    <main className="h-full grid grid-cols-3 grid-rows-2 gap-4 p-6 bg-gray-50">
      <div className="bg-white rounded-lg p-4 shadow col-span-2">
        <div className="flex justify-between items-start gap-4">
          {/* Left: Energy Card */}
          <EnergyAccountCard />

          {/* Right: Market Price Chart */}
          <div className="w-[500px]">
            <MarketPriceChart />
            {/* Market Price Section */}
            <div className="flex flex-col items-end gap-2 pr-10">
              {/* Price below */}
              <p className="text-m text-gray-700 whitespace-nowrap">Market Price: $0.5 / kWh</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow center left-50">
        <BuySellCard />
      </div>

      <div className="bg-white rounded-lg p-4 shadow col-span-2">
        <EnergyChart />
      </div>
      <div className="h-full">
        <WeatherCard />
      </div>
    </main>
  );
}
