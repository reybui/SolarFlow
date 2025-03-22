"use client";

import React from "react";
import { EnergyAccountCard } from "../../components/EnergyAccountCard";
import { BuySellCard } from "~~/components/BuySellCard";
import { EnergyChart } from "~~/components/EnergyChart";
import { WeatherCard } from "~~/components/WeatherCard";

export default function DashboardPage() {
  return (
    <main className="h-full grid grid-cols-3 grid-rows-2 gap-4 p-6 bg-gray-50">
      <div className="bg-white rounded-lg p-4 shadow col-span-2">
        <EnergyAccountCard />
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
