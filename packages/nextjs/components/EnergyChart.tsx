import React from "react";
import smartMeterData from "./smartMeterdata.json";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const EnergyChart = () => {
  // Process data and preserve chronological order
  const processedData = smartMeterData.smartMeterData.map(entry => {
    const date = new Date(entry.timestamp);
    return {
      ...entry,
      date,
      day: date.toLocaleDateString("en-US", { weekday: "long" }),
      fullDate: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    };
  });

  // Sort by timestamp to ensure chronological order
  processedData.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Aggregate data by day
  const aggregatedData = processedData.reduce(
    (
      acc: Record<
        string,
        {
          day: string;
          fullDate: string;
          energyGenerated: number;
          energyConsumed: number;
          batteryStatus: number;
          timestamp: string;
        }
      >,
      entry,
    ) => {
      const key = entry.fullDate;
      if (!acc[key]) {
        acc[key] = {
          day: entry.day,
          fullDate: entry.fullDate,
          energyGenerated: 0,
          energyConsumed: 0,
          batteryStatus: entry.batteryStatus,
          timestamp: entry.timestamp,
        };
      }
      acc[key].energyGenerated += entry.energyGenerated || 0;
      acc[key].energyConsumed += entry.energyConsumed || 0;
      acc[key].batteryStatus = entry.batteryStatus;
      return acc;
    },
    {},
  );

  // Convert the aggregated object into an array and ensure chronological order
  const data = Object.values(aggregatedData).sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  return (
    <div className="flex flex-col items-center text-left pb-10, pt-4">
      {" "}
      {/* Added pb-10 for padding-bottom */}
      <h2 className="text-m font-bold mb-6 text-black text-left">Energy Data (Daily)</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fullDate" />
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
