"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import BrazilMapChart, { type CityPoint } from "./BrazilMapChart";

interface DataPoint {
  name: string;
  visits: number;
}

interface DayPoint {
  day: string;
  visits: number;
}

interface Props {
  visitsByDay: DayPoint[];
  topPages: DataPoint[];
  deviceData: DataPoint[];
  browserData: DataPoint[];
  topCountries: DataPoint[];
  referrerData: DataPoint[];
  cityData: CityPoint[];
}

const COLORS = ["#1a3a6b", "#16a34a", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#f97316"];

const DEVICE_COLORS: Record<string, string> = {
  desktop: "#1a3a6b",
  mobile: "#16a34a",
  tablet: "#f59e0b",
  Desconhecido: "#9ca3af",
};

export default function AnalyticsCharts({
  visitsByDay,
  topPages,
  deviceData,
  browserData,
  topCountries,
  referrerData,
  cityData,
}: Props) {
  return (
    <div className="space-y-6">
      {/* Mapa de Acessos */}
      <BrazilMapChart cities={cityData} />
      {/* Visitas por dia */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Visitas por dia (últimos 30 dias)</h2>
        {visitsByDay.every((d) => d.visits === 0) ? (
          <EmptyState />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={visitsByDay} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "#6b7280" }}
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
                labelFormatter={(l) => `Dia ${l}`}
              />
              <Line
                type="monotone"
                dataKey="visits"
                stroke="#1a3a6b"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                name="Visitas"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Top páginas + Dispositivos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Páginas mais acessadas</h2>
          {topPages.length === 0 ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={topPages.slice(0, 8)}
                layout="vertical"
                margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#6b7280" }} allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "#6b7280" }}
                  width={120}
                  tickFormatter={(v: string) => (v.length > 18 ? v.slice(0, 18) + "…" : v)}
                />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
                />
                <Bar dataKey="visits" fill="#1a3a6b" radius={[0, 4, 4, 0]} name="Visitas" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Dispositivos</h2>
          {deviceData.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={deviceData}
                    dataKey="visits"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {deviceData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={DEVICE_COLORS[entry.name] ?? "#9ca3af"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
                  />
                  <Legend
                    formatter={(value: string) =>
                      value.charAt(0).toUpperCase() + value.slice(1)
                    }
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {deviceData.map((d) => (
                  <div key={d.name} className="text-center">
                    <p className="text-xs text-gray-500 capitalize">{d.name}</p>
                    <p className="font-semibold text-gray-800">{d.visits}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Países + Navegadores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Países de origem</h2>
          {topCountries.length === 0 ? (
            <EmptyState text="Sem dados de localização ainda" />
          ) : (
            <div className="space-y-2">
              {topCountries.map((c, i) => {
                const max = topCountries[0].visits;
                const pct = Math.round((c.visits / max) * 100);
                return (
                  <div key={c.name} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-4 text-right">{i + 1}</span>
                    <span className="text-sm text-gray-700 w-28 truncate">{c.name}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full bg-brand-blue"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 w-8 text-right">
                      {c.visits}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Navegadores</h2>
          {browserData.length === 0 ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={browserData} margin={{ top: 0, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b7280" }} />
                <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
                />
                <Bar dataKey="visits" radius={[4, 4, 0, 0]} name="Visitas">
                  {browserData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Referrers */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Origens de tráfego (referrers)</h2>
        {referrerData.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 pr-4 text-gray-500 font-medium">Origem</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Visitas</th>
                  <th className="text-right py-2 pl-4 text-gray-500 font-medium w-32">%</th>
                </tr>
              </thead>
              <tbody>
                {referrerData.map((r) => {
                  const total = referrerData.reduce((s, x) => s + x.visits, 0);
                  const pct = ((r.visits / total) * 100).toFixed(1);
                  return (
                    <tr key={r.name} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2 pr-4 text-gray-700 max-w-xs truncate">{r.name}</td>
                      <td className="py-2 text-right font-medium text-gray-800">{r.visits}</td>
                      <td className="py-2 pl-4 text-right text-gray-400">{pct}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ text = "Sem dados ainda" }: { text?: string }) {
  return (
    <div className="flex items-center justify-center h-32 text-gray-400 text-sm">{text}</div>
  );
}
