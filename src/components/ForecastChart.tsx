import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { Forecast } from "../types";

type ForecastChartProps = {
  forecast: Forecast;
};

function ForecastChart({ forecast }: ForecastChartProps) {
  const data = forecast.list
    .filter((_, i) => i % 8 === 0)
    .map((item) => ({
      date: item.dt_txt.split(" ")[0],
      temp: Math.round(item.main.temp),
      min: Math.round(item.main.temp_min),
      max: Math.round(item.main.temp_max),
    }));

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md mt-4">
      <h3 className="text-white font-bold mb-4">5-Day Forecast</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} unit="°" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "none",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#94a3b8" }}
            itemStyle={{ color: "#60a5fa" }}
          />
          <Line
            type="monotone"
            dataKey="temp"
            stroke="#60a5fa"
            strokeWidth={2}
            dot={{ fill: "#60a5fa" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ForecastChart;
