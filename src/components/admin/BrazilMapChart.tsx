"use client";

import { useState, useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";

const BRAZIL_TOPO =
  "https://cdn.jsdelivr.net/gh/deldersveld/topojson@master/countries/brazil/brazil-states.json";

// Bounding box aproximado de Alagoas
const isInAlagoas = (lat: number, lng: number) =>
  lat >= -11.0 && lat <= -8.8 && lng >= -38.2 && lng <= -35.1;

export interface CityPoint {
  city: string;
  visits: number;
  lat: number;
  lng: number;
}

interface Props {
  cities: CityPoint[];
}

export default function BrazilMapChart({ cities }: Props) {
  const [view, setView] = useState<"brazil" | "alagoas">("brazil");

  const alagoasCities = useMemo(
    () => cities.filter((c) => isInAlagoas(c.lat, c.lng)),
    [cities]
  );

  const activeCities = view === "alagoas" ? alagoasCities : cities;
  const maxVisits = Math.max(...activeCities.map((c) => c.visits), 1);

  const mapCenter: [number, number] = view === "brazil" ? [-53, -15] : [-36.7, -9.7];
  const mapZoom = view === "brazil" ? 1 : 8;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-semibold text-gray-800">Mapa de Acessos</h2>
          <p className="text-xs text-gray-400 mt-0.5">Por cidade de origem</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView("brazil")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              view === "brazil"
                ? "bg-brand-blue text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Brasil
          </button>
          <button
            onClick={() => setView("alagoas")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              view === "alagoas"
                ? "bg-brand-blue text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Alagoas
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Mapa */}
        <div
          className="flex-1 bg-gray-50 rounded-lg overflow-hidden"
          style={{ height: 380 }}
        >
          {cities.length === 0 ? (
            <div className="flex items-center justify-center h-full text-sm text-gray-400">
              Sem dados de localização ainda
            </div>
          ) : (
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 850 }}
              style={{ width: "100%", height: "100%" }}
            >
              <ZoomableGroup center={mapCenter} zoom={mapZoom}>
                <Geographies geography={BRAZIL_TOPO}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const isAL = geo.properties.name === "Alagoas";
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={isAL ? "#bfdbfe" : "#e5e7eb"}
                          stroke="#ffffff"
                          strokeWidth={0.5}
                          style={{
                            default: { outline: "none" },
                            hover: { fill: "#93c5fd", outline: "none" },
                            pressed: { outline: "none" },
                          }}
                        />
                      );
                    })
                  }
                </Geographies>

                {activeCities.map((city) => {
                  const r = 4 + (city.visits / maxVisits) * 14;
                  return (
                    <Marker
                      key={city.city}
                      coordinates={[city.lng, city.lat]}
                    >
                      <circle
                        r={r}
                        fill="#1a3a6b"
                        fillOpacity={0.55}
                        stroke="#ffffff"
                        strokeWidth={1}
                      />
                    </Marker>
                  );
                })}
              </ZoomableGroup>
            </ComposableMap>
          )}
        </div>

        {/* Lista ranqueada */}
        <div className="w-52 flex-shrink-0">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            {view === "alagoas" ? "Cidades em Alagoas" : "Top cidades"}
          </p>

          {activeCities.length === 0 ? (
            <p className="text-sm text-gray-400">Sem dados para exibir</p>
          ) : (
            <div className="space-y-3">
              {activeCities.slice(0, 8).map((city) => {
                const pct = Math.round((city.visits / maxVisits) * 100);
                return (
                  <div key={city.city}>
                    <div className="flex justify-between items-baseline text-sm mb-1">
                      <span className="text-gray-700 truncate">{city.city}</span>
                      <span className="font-semibold text-gray-800 ml-2 tabular-nums">
                        {city.visits.toLocaleString("pt-BR")}
                      </span>
                    </div>
                    <div className="bg-gray-100 rounded-full h-1.5">
                      <div
                        className="bg-brand-blue h-1.5 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
