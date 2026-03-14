import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import DashboardStats from "@/components/admin/DashboardStats";
import { NEWS_STATUS_COLORS, NEWS_STATUS_LABELS } from "@/lib/constants";
import { NewsWithCategory } from "@/types/database";
import { Newspaper, FileText, Video, ArrowRight, PlusCircle } from "lucide-react";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch stats in parallel
  const [
    { count: publishedNewsCount },
    { count: openEditaisCount },
    { count: totalVideosCount },
    { data: recentNews },
  ] = await Promise.all([
    supabase
      .from("news")
      .select("*", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("editais")
      .select("*", { count: "exact", head: true })
      .eq("status", "aberto"),
    supabase
      .from("videos")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("news")
      .select(
        `
        id,
        title,
        status,
        published_at,
        created_at,
        news_categories ( id, name, slug, color, created_at ),
        profiles ( full_name )
      `
      )
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const news = (recentNews ?? []) as unknown as NewsWithCategory[];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Bem-vindo ao painel administrativo da Prefeitura de Feliz Deserto.
          </p>
        </div>
        <Link
          href="/admin/noticias/nova"
          className="inline-flex items-center gap-2 bg-[#1a3a6b] hover:bg-[#2a5298] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors duration-150"
        >
          <PlusCircle className="w-4 h-4" />
          Nova Notícia
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <DashboardStats
          title="Notícias Publicadas"
          value={publishedNewsCount ?? 0}
          icon={<Newspaper className="w-6 h-6 text-white" />}
          color="bg-[#1a3a6b]"
          description="Total de notícias no ar"
        />
        <DashboardStats
          title="Editais Abertos"
          value={openEditaisCount ?? 0}
          icon={<FileText className="w-6 h-6 text-white" />}
          color="bg-[#16a34a]"
          description="Editais em andamento"
        />
        <DashboardStats
          title="Total de Vídeos"
          value={totalVideosCount ?? 0}
          icon={<Video className="w-6 h-6 text-white" />}
          color="bg-[#f59e0b]"
          description="Vídeos cadastrados"
        />
      </div>

      {/* Recent news table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Últimas Notícias</h2>
          <Link
            href="/admin/noticias"
            className="inline-flex items-center gap-1.5 text-sm text-[#1a3a6b] hover:text-[#2a5298] font-medium transition-colors"
          >
            Ver todas
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {news.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Newspaper className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Nenhuma notícia cadastrada ainda.</p>
            <Link
              href="/admin/noticias/nova"
              className="inline-flex items-center gap-2 mt-4 text-sm text-[#1a3a6b] font-medium hover:underline"
            >
              <PlusCircle className="w-4 h-4" />
              Criar primeira notícia
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Categoria
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Data
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                    Autor
                  </th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {news.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900 line-clamp-1 max-w-xs">
                        {item.title}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      {item.news_categories ? (
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                          style={{
                            backgroundColor: `${item.news_categories.color}20`,
                            color: item.news_categories.color,
                          }}
                        >
                          {item.news_categories.name}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          NEWS_STATUS_COLORS[item.status] ?? "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {NEWS_STATUS_LABELS[item.status] ?? item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs hidden lg:table-cell whitespace-nowrap">
                      {formatDate(item.published_at ?? item.created_at)}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs hidden xl:table-cell">
                      {item.profiles?.full_name ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/noticias/${item.id}`}
                        className="text-[#1a3a6b] hover:text-[#2a5298] text-xs font-medium hover:underline"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            label: "Gerenciar Editais",
            description: "Adicione e atualize editais e licitações",
            href: "/admin/editais",
            icon: "📄",
            color: "border-l-[#16a34a]",
          },
          {
            label: "Gerenciar Vídeos",
            description: "Publique vídeos do YouTube no portal",
            href: "/admin/videos",
            icon: "🎬",
            color: "border-l-[#f59e0b]",
          },
          {
            label: "Configurações",
            description: "Ajuste textos e configurações do site",
            href: "/admin/configuracoes",
            icon: "⚙️",
            color: "border-l-[#1a3a6b]",
          },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition-shadow duration-200 border-l-4 ${link.color}`}
          >
            <span className="text-2xl flex-shrink-0">{link.icon}</span>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm">{link.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{link.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
