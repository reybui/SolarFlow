"use client";

import React, { useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// 🔧 Mock data (replace with real API/fetch later)
const generateMockData = () => {
  const now = new Date();
  const data = [];

  for (let i = 0; i < 365; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    data.unshift({
      date: date.toISOString().split("T")[0], // "YYYY-MM-DD"
      price: parseFloat((0.2 + Math.random() * 0.2).toFixed(3)), // between 0.2–0.4
    });
  }

  return data;
};

const fullData = generateMockData();

// Export the current day's price for use in other components
export const getCurrentMarketPrice = () => {
  // Get the most recent day's price (last item in the array)
  return fullData[fullData.length - 1].price;
};

export const MarketPriceChart = () => {
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month">("week");

  // Filter based on timeRange
  const filteredData = {
    day: fullData.slice(-1),
    week: fullData.slice(-7),
    month: fullData.slice(-30),
  }[timeRange];

  return (
    <div className="w-full h-full rounded-lg flex flex-col justify-between py-6">
      <div className="flex-1"></div> {/* Spacer */}
      {/* Range Selector - Positioned lower */}
      <div className="flex justify-center gap-2 mb-4">
        {["day", "week", "month"].map(range => (
          <button
            key={range}
            onClick={() => setTimeRange(range as "day" | "week" | "month")}
            className={`btn btn-sm ${timeRange === range ? "btn-primary" : "btn-outline text-gray-800"}`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>
      {/* Chart - Also positioned lower */}
      <ResponsiveContainer width={300} height={180}>
        <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={tick => tick.slice(5)} />
          <YAxis unit=" $" />
          <Tooltip formatter={(value: number) => `$${value.toFixed(3)}`} />
          <Legend />
          <Line type="monotone" dataKey="price" stroke="#4f46e5" name="Market Price ($/kWh)" />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex-1"></div> {/* Spacer */}
    </div>
  );
};
