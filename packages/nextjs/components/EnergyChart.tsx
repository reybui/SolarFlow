import React from "react";
import smartMeterData from "./smartMeterdata.json";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const EnergyChart = () => {
  // Aggregate data by day
  const aggregatedData = smartMeterData.smartMeterData.reduce(
    (
      acc: Record<string, { day: string; energyGenerated: number; energyConsumed: number; batteryStatus: number }>,
      entry,
    ) => {
      const day = new Date(entry.timestamp).toLocaleDateString("en-US", { weekday: "long" }); // Get the day of the week (e.g., "Monday")
      if (!acc[day]) {
        acc[day] = {
          day,
          energyGenerated: 0,
          energyConsumed: 0,
          batteryStatus: entry.batteryStatus, // Use the latest battery status for the day
        };
      }
      acc[day].energyGenerated += entry.energyGenerated || 0;
      acc[day].energyConsumed += entry.energyConsumed || 0;
      acc[day].batteryStatus = entry.batteryStatus; // Update to the latest battery status
      return acc;
    },
    {},
  );

  // Convert the aggregated object into an array
  const data = Object.values(aggregatedData);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">Energy Data (Daily)</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="energyGenerated" stroke="#8884d8" name="Energy Generated (kWh)" />
          <Line type="monotone" dataKey="energyConsumed" stroke="#82ca9d" name="Energy Consumed (kWh)" />
          <Line type="monotone" dataKey="batteryStatus" stroke="#ffc658" name="Battery Status (%)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
