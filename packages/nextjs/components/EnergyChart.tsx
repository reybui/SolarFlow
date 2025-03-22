import React from "react";
import smartMeterData from "./smartMeterdata.json";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Adjust the path if necessary

export const EnergyChart = () => {
  // Extract the data from the JSON file
  const data = smartMeterData.smartMeterData.map(entry => ({
    timestamp: new Date(entry.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    energyGenerated: entry.energyGenerated,
    energyConsumed: entry.energyConsumed,
    batteryStatus: entry.batteryStatus,
  }));

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">Energy Data</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
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
