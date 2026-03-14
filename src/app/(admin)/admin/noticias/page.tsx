import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { NEWS_STATUS_COLORS, NEWS_STATUS_LABELS, ITEMS_PER_PAGE } from "@/lib/constants";
import { NewsWithCategory } from "@/types/database";
import { PlusCircle, Search, Newspaper, Pencil } from "lucide-react";

interface SearchParams {
  page?: string;
  status?: string;
  q?: string;
}

interface AdminNoticiasPageProps {
  searchParams: Promise<SearchParams>;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateStr));
}

export default async function AdminNoticiasPage({ searchParams }: AdminNoticiasPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const status = params.status ?? "";
  const q = params.q ?? "";

  const supabase = await createClient();

  // Build query
  let query = supabase
    .from("news")
    .select(
      `
      id,
      title,
      slug,
      status,
      published_at,
      created_at,
      views,
      news_categories ( id, name, slug, color, created_at ),
      profiles ( full_name )
    `,
      { count: "exact" }
    );

  if (status) {
    query = query.eq("status", status);
  }
  if (q) {
    query = query.ilike("title", `%${q}%`);
  }

  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  const news = (data ?? []) as unknown as NewsWithCategory[];
  const totalPages = Math.ceil((count ?? 0) / ITEMS_PER_PAGE);

  const buildUrl = (updates: Partial<SearchParams>) => {
    const merged = { page: "1", status, q, ...updates };
    const qs = new URLSearchParams();
    if (merged.page && merged.page !== "1") qs.set("page", merged.page);
    if (merged.status) qs.set("status", merged.status);
    if (merged.q) qs.set("q", merged.q);
    const str = qs.toString();
    return `/admin/noticias${str ? `?${str}` : ""}`;
  };

  const STATUS_FILTER_OPTIONS = [
    { value: "", label: "Todos" },
    { value: "published", label: "Publicado" },
    { value: "draft", label: "Rascunho" },
    { value: "scheduled", label: "Agendado" },
    { value: "archived", label: "Arquivado" },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notícias</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gerencie as notícias publicadas no portal.
            {count !== null && (
              <span className="ml-1 text-gray-400">
                ({count} {count === 1 ? "registro" : "registros"})
              </span>
            )}
          </p>
        </div>
        <Link
          href="/admin/noticias/novo"
          className="inline-flex items-center gap-2 bg-[#1a3a6b] hover:bg-[#2a5298] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors duration-150"
        >
          <PlusCircle className="w-4 h-4" />
          Nova Notícia
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <form method="GET" action="/admin/noticias" className="flex-1">
            {status && <input type="hidden" name="status" value={status} />}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Buscar por título..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]/20 focus:border-[#1a3a6b] transition-colors"
              />
            </div>
          </form>

          {/* Status filter */}
          <div className="flex items-center gap-2 flex-wrap">
            {STATUS_FILTER_OPTIONS.map((opt) => (
              <Link
                key={opt.value}
                href={buildUrl({ status: opt.value, page: "1" })}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  status === opt.value
                    ? "bg-[#1a3a6b] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {opt.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {error ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-red-600">Erro ao carregar notícias. Tente novamente.</p>
          </div>
        ) : news.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Nenhuma notícia encontrada.</p>
            {(q || status) && (
              <p className="text-sm text-gray-400 mt-1">
                Tente ajustar os filtros de busca.
              </p>
            )}
            <Link
              href="/admin/noticias/novo"
              className="inline-flex items-center gap-2 mt-5 bg-[#1a3a6b] hover:bg-[#2a5298] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Criar primeira notícia
            </Link>
          </div>
        ) : (
          <>
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
                      Autor
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Publicado em
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                      Views
                    </th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {news.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/60 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-gray-900 line-clamp-1 max-w-xs">
                            {item.title}
                          </span>
                          <span className="text-xs text-gray-400 hidden sm:block">
                            /{item.slug}
                          </span>
                        </div>
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
                          <span className="text-gray-400 text-xs">Sem categoria</span>
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
                      <td className="px-6 py-4 text-gray-500 text-xs hidden lg:table-cell">
                        {item.profiles?.full_name ?? "—"}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs hidden lg:table-cell whitespace-nowrap">
                        {item.published_at ? formatDate(item.published_at) : (
                          <span className="text-gray-300">Não publicado</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs hidden xl:table-cell tabular-nums">
                        {item.views.toLocaleString("pt-BR")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/noticias/${item.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-600 text-xs transition-colors"
                            title="Ver no site"
                          >
                            Ver
                          </Link>
                          <Link
                            href={`/admin/noticias/${item.id}`}
                            className="inline-flex items-center gap-1.5 text-[#1a3a6b] hover:text-[#2a5298] text-xs font-medium transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            Editar
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-4">
                <p className="text-sm text-gray-500">
                  Página {page} de {totalPages} —{" "}
                  <span className="font-medium">{count} notícias</span>
                </p>

                <div className="flex items-center gap-1.5">
                  {/* Previous */}
                  {page > 1 ? (
                    <Link
                      href={buildUrl({ page: String(page - 1) })}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                    >
                      Anterior
                    </Link>
                  ) : (
                    <span className="px-3 py-1.5 rounded-lg border border-gray-100 text-sm text-gray-300 cursor-not-allowed">
                      Anterior
                    </span>
                  )}

                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <Link
                        key={pageNum}
                        href={buildUrl({ page: String(pageNum) })}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm transition-colors ${
                          pageNum === page
                            ? "bg-[#1a3a6b] text-white font-semibold"
                            : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </Link>
                    );
                  })}

                  {/* Next */}
                  {page < totalPages ? (
                    <Link
                      href={buildUrl({ page: String(page + 1) })}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                    >
                      Próxima
                    </Link>
                  ) : (
                    <span className="px-3 py-1.5 rounded-lg border border-gray-100 text-sm text-gray-300 cursor-not-allowed">
                      Próxima
                    </span>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
