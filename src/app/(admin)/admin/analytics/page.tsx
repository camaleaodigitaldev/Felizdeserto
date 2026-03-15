import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AnalyticsCharts from "@/components/admin/AnalyticsCharts";

export const metadata = { title: "Analytics" };

// Tipo retornado pelo Supabase
interface PageviewRow {
  path: string;
  referrer: string | null;
  country: string | null;
  country_code: string | null;
  city: string | null;
  lat: number | null;
  lng: number | null;
  device: string | null;
  browser: string | null;
  os: string | null;
  created_at: string;
}

function groupCount(
  rows: PageviewRow[],
  key: keyof PageviewRow
): { name: string; visits: number }[] {
  const map = new Map<string, number>();
  for (const row of rows) {
    const val = (row[key] as string | null) || "Desconhecido";
    map.set(val, (map.get(val) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([name, visits]) => ({ name, visits }))
    .sort((a, b) => b.visits - a.visits);
}

function formatDay(iso: string) {
  return iso.slice(0, 10); // "YYYY-MM-DD"
}

export default async function AnalyticsPage() {
  // Verificar autenticação
  const auth = await createClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) redirect("/login");

  const supabase = createAdminClient();

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // Buscar dados dos últimos 30 dias
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rows = [] } = await (supabase as any)
    .from("analytics_pageviews")
    .select("path, referrer, country, country_code, city, lat, lng, device, browser, os, created_at")
    .gte("created_at", thirtyDaysAgo)
    .order("created_at", { ascending: true }) as { data: PageviewRow[] | null };

  const safeRows = rows ?? [];

  // Métricas de resumo
  const totalViews = safeRows.length;
  const todayViews = safeRows.filter((r) => r.created_at >= todayStart).length;
  const last7Days = safeRows.filter((r) => r.created_at >= sevenDaysAgo).length;

  // Visitas por dia (últimos 30 dias) — preenche dias sem visita com 0
  const visitsByDayMap = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    visitsByDayMap.set(formatDay(d.toISOString()), 0);
  }
  for (const row of safeRows) {
    const day = formatDay(row.created_at);
    if (visitsByDayMap.has(day)) {
      visitsByDayMap.set(day, (visitsByDayMap.get(day) ?? 0) + 1);
    }
  }
  const visitsByDay = Array.from(visitsByDayMap.entries()).map(([day, visits]) => ({
    day: day.slice(5), // "MM-DD"
    visits,
  }));

  // Top 10 páginas
  const topPages = groupCount(safeRows, "path").slice(0, 10);

  // Top país
  const topCountriesFull = groupCount(
    safeRows.filter((r) => r.country != null),
    "country"
  ).slice(0, 10);
  const topCountry = topCountriesFull[0]?.name ?? "—";

  // Dispositivos
  const deviceData = groupCount(safeRows, "device");

  // Navegadores
  const browserData = groupCount(safeRows, "browser").slice(0, 6);

  // Cidades com coordenadas (para o mapa)
  const cityMap = new Map<string, { visits: number; lat: number; lng: number }>();
  for (const row of safeRows) {
    if (!row.city || row.lat == null || row.lng == null) continue;
    if (!cityMap.has(row.city)) {
      cityMap.set(row.city, { visits: 0, lat: row.lat, lng: row.lng });
    }
    cityMap.get(row.city)!.visits++;
  }
  const cityData = Array.from(cityMap.entries())
    .map(([city, d]) => ({ city, visits: d.visits, lat: d.lat, lng: d.lng }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 60);

  // Top referrers (remove null/vazio → "Direto")
  const referrerData = groupCount(
    safeRows.map((r) => ({ ...r, referrer: r.referrer || "Direto" })),
    "referrer"
  ).slice(0, 8);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Últimos 30 dias de acesso ao site</p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Pageviews (30d)" value={totalViews.toLocaleString("pt-BR")} color="blue" />
        <StatCard label="Hoje" value={todayViews.toLocaleString("pt-BR")} color="green" />
        <StatCard label="Últimos 7 dias" value={last7Days.toLocaleString("pt-BR")} color="purple" />
        <StatCard label="País líder" value={topCountry} color="amber" />
      </div>

      <AnalyticsCharts
        visitsByDay={visitsByDay}
        topPages={topPages}
        deviceData={deviceData}
        browserData={browserData}
        topCountries={topCountriesFull}
        referrerData={referrerData}
        cityData={cityData}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: "blue" | "green" | "purple" | "amber";
}) {
  const colors = {
    blue: "bg-blue-50 border-blue-100 text-blue-700",
    green: "bg-green-50 border-green-100 text-green-700",
    purple: "bg-purple-50 border-purple-100 text-purple-700",
    amber: "bg-amber-50 border-amber-100 text-amber-700",
  };
  return (
    <div className={`rounded-xl border p-4 ${colors[color]}`}>
      <p className="text-xs font-medium opacity-70 mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
