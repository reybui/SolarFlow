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

export const MarketPriceChart = () => {
  const [timeRange, setTimeRange] = useState<"day" | "month" | "year">("month");

  // Filter based on timeRange
  const filteredData = {
    day: fullData.slice(-1),
    month: fullData.slice(-30),
    year: fullData,
  }[timeRange];

  return (
    <div className="w-full 0.5rem rounded-lg flex flex-col gap-4">
      <div className="flex justify-between items-center">
        {/* Range Selector */}
        <div className="flex gap-2">
          {["day", "month", "year"].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range as "day" | "month" | "year")}
              className={`btn btn-sm ${timeRange === range ? "btn-primary" : "btn-outline"}`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
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
    </div>
  );
};
