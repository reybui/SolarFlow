import React, { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const CITY = "Auckland";

interface HistoricalDay {
  date: string;
  avgtemp_c: number;
  condition: {
    text: string;
    icon: string;
  };
}

interface ForecastDay {
  date: string;
  day: {
    avgtemp_c: number;
    condition: {
      text: string;
      icon: string;
    };
  };
}

export const WeatherCard = () => {
  const [weather, setWeather] = useState<any>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalDay[]>([]);
  const [forecastData, setForecastData] = useState<ForecastDay[]>([]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        console.log("Fetching weather for:", CITY);
        // Get current weather and 3-day forecast in the same call
        const res = await axios.get(
          `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${CITY}&days=3&aqi=no`,
        );
        setWeather(res.data);

        // Save forecast data
        if (res.data.forecast && res.data.forecast.forecastday) {
          setForecastData(res.data.forecast.forecastday);
        }

        // Fetch historical data for the past 3 days
        const today = new Date();
        const historicalDays: HistoricalDay[] = [];

        for (let i = 1; i <= 3; i++) {
          const pastDate = new Date(today);
          pastDate.setDate(today.getDate() - i);
          const dateStr = pastDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD

          try {
            const histRes = await axios.get(
              `https://api.weatherapi.com/v1/history.json?key=${API_KEY}&q=${CITY}&dt=${dateStr}`,
            );

            if (histRes.data && histRes.data.forecast && histRes.data.forecast.forecastday[0]) {
              const dayData = histRes.data.forecast.forecastday[0].day;
              historicalDays.push({
                date: dateStr,
                avgtemp_c: dayData.avgtemp_c,
                condition: {
                  text: dayData.condition.text,
                  icon: dayData.condition.icon,
                },
              });
            }
          } catch (histErr) {
            console.error(`Failed to fetch historical data for ${dateStr}:`, histErr);
          }
        }

        setHistoricalData(historicalDays);
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-md overflow-hidden">
      {/* Current Weather */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <img
            src={`https:${weather.current.condition.icon}`}
            alt={weather.current.condition.text}
            className="w-12 h-12"
          />
          <div>
            <div className="text-black text-sm font-medium">Current - {weather.location.name}</div>
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

      {/* Historical Weather */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Past Weather</h3>
        <div className="grid grid-cols-3 gap-2">
          {historicalData.map((day, index) => (
            <div key={index} className="bg-gray-50 rounded p-2 text-center">
              <div className="text-xs text-gray-600 mb-1">{formatDate(day.date)}</div>
              <img src={`https:${day.condition.icon}`} alt={day.condition.text} className="w-8 h-8 mx-auto" />
              <div className="text-sm font-medium text-gray-700">{Math.round(day.avgtemp_c)}°C</div>
            </div>
          ))}
        </div>
      </div>

      {/* Forecast Weather */}
      <div className="p-3 border-t border-gray-100">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Forecast</h3>
        <div className="grid grid-cols-3 gap-2">
          {forecastData.map((forecast, index) => (
            <div key={index} className="bg-blue-50 rounded p-2 text-center">
              <div className="text-xs text-gray-600 mb-1">{formatDate(forecast.date)}</div>
              <img
                src={`https:${forecast.day.condition.icon}`}
                alt={forecast.day.condition.text}
                className="w-8 h-8 mx-auto"
              />
              <div className="text-sm font-medium text-gray-700">{Math.round(forecast.day.avgtemp_c)}°C</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
