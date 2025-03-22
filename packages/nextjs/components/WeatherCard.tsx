import React, { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const CITY = "Auckland";

export const WeatherCard = () => {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        console.log("Fetching weather for:", CITY);
        const res = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${CITY}&aqi=no`);
        setWeather(res.data);
      } catch (err) {
        console.error("Weather fetch failed:", err);
        if (axios.isAxiosError(err)) {
          console.error("Axios error response:", err.response?.data);
        }
      }
    };

    fetchWeather();
  }, []);

  if (!weather) {
    return <div className="text-gray-500">Loading weather...</div>;
  }

  return (
    <div className="flex items-center justify-between w-full max-w-md p-4 bg-white rounded-2xl shadow-md">
      <div className="flex items-center gap-4">
        <img
          src={`https:${weather.current.condition.icon}`}
          alt={weather.current.condition.text}
          className="w-12 h-12"
        />
        <div>
          <div className="text-black text-sm">{weather.location.name}</div>
          <div className="text-3xl font-bold text-black">
            {Math.round(weather.current.temp_c)}
            <span className="text-base align-top">°C</span>
          </div>
        </div>
      </div>

      <div className="pl-4 border-l border-gray-200">
        <div className="text-sm font-medium text-gray-800">Humidity</div>
        <div className="text-xs text-gray-500 mb-2">{weather.current.humidity}%</div>
        <div className="text-sm font-medium text-gray-800">Wind</div>
        <div className="text-xs text-gray-500">{weather.current.wind_kph} km/h</div>
      </div>
    </div>
  );
};
