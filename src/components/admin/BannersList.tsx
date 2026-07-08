"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Banner } from "@/types/database";

export default function BannersList({ initial }: { initial: Banner[] }) {
  const supabase = createClient();
  const [items, setItems] = useState<Banner[]>(initial);
  const [error, setError] = useState("");
  const [savingOrder, setSavingOrder] = useState(false);
  const normalized = useRef(false);

  // Persiste no banco apenas as linhas cujo número de ordem mudou.
  async function persist(next: Banner[], prev: Banner[]) {
    const changed = next.filter((b) => {
      const before = prev.find((x) => x.id === b.id);
      return before?.display_order !== b.display_order;
    });
    if (changed.length === 0) return;
    setSavingOrder(true);
    setError("");
    try {
      await Promise.all(
        changed.map((b) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (supabase as any)
            .from("banners")
            .update({ display_order: b.display_order })
            .eq("id", b.id)
        )
      );
    } catch {
      setError("Erro ao salvar a nova ordem. Recarregue a página e tente novamente.");
    } finally {
      setSavingOrder(false);
    }
  }

  // Ao abrir a tela, corrige números duplicados/desalinhados uma única vez,
  // deixando a ordem sequencial (1, 2, 3, ...).
  useEffect(() => {
    if (normalized.current) return;
    normalized.current = true;
    const needsFix = items.some((b, i) => b.display_order !== i + 1);
    if (needsFix) {
      const fixed = items.map((b, i) => ({ ...b, display_order: i + 1 }));
      setItems(fixed);
      persist(fixed, items);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const prev = items;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    const renumbered = next.map((b, i) => ({ ...b, display_order: i + 1 }));
    setItems(renumbered);
    persist(renumbered, prev);
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
        <svg className="w-12 h-12 text-gray-200 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-gray-400">Nenhum banner cadastrado</p>
        <Link href="/admin/banners/novo" className="inline-flex items-center gap-1.5 mt-3 text-sm text-brand-blue hover:underline">
          + Criar primeiro banner
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-400">
          Use as setas <strong>▲▼</strong> para ordenar. O primeiro da lista aparece primeiro no site.
        </p>
        {savingOrder && <span className="text-xs text-brand-blue">Salvando ordem...</span>}
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>}

      <div className="space-y-3">
        {items.map((banner, index) => (
          <div
            key={banner.id}
            className={`bg-white rounded-2xl border shadow-sm overflow-hidden flex items-stretch transition-all ${
              banner.is_active ? "border-gray-200" : "border-gray-100 opacity-60"
            }`}
          >
            {/* Controles de ordem */}
            <div className="flex flex-col items-center justify-center gap-1 px-2 sm:px-3 bg-gray-50 border-r border-gray-100">
              <button
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label="Mover para cima"
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-white hover:text-brand-blue disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg>
              </button>
              <span className="text-xs font-bold text-gray-400 tabular-nums">{index + 1}</span>
              <button
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1}
                aria-label="Mover para baixo"
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-white hover:text-brand-blue disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
              </button>
            </div>

            {/* Thumbnail */}
            <div className="relative w-28 sm:w-44 flex-shrink-0 bg-brand-blue">
              {banner.image_url ? (
                <Image src={banner.image_url} alt={banner.title} fill className="object-cover" sizes="176px" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 p-4 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900 truncate">{banner.title}</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                    banner.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {banner.is_active ? "Ativo" : "Inativo"}
                  </span>
                </div>
                {banner.subtitle && <p className="text-sm text-gray-400 truncate">{banner.subtitle}</p>}
              </div>
              <Link href={`/admin/banners/${banner.id}`} className="btn-outline text-sm flex-shrink-0">Editar</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
