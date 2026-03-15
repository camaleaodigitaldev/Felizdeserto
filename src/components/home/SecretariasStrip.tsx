"use client";

import Link from "next/link";
import { useState } from "react";
import {
  GraduationCap, HeartPulse, HandHeart, Building2, Landmark,
  Wheat, HardHat, MapPin, ClipboardList, Trophy,
  Leaf, Car, Home, Megaphone, Scale, Shield,
  Cpu, Briefcase, Users, Baby, Droplets, Zap,
  Music, BookOpen, Globe, ChevronLeft, ChevronRight,
  type LucideIcon,
} from "lucide-react";
import type { Secretaria } from "@/types/database";

interface Props {
  secretarias: Secretaria[];
}

// ── Icon + color mapping by area keyword ────────────────────────────────────
type SecConfig = { icon: LucideIcon; from: string; to: string };

function getConfig(name: string): SecConfig {
  const n = (name ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  if (n.includes("educ") || n.includes("ensino"))
    return { icon: GraduationCap, from: "#1d4ed8", to: "#3b82f6" };
  if (n.includes("saude") || n.includes("saúde") || n.includes("sanit"))
    return { icon: HeartPulse, from: "#dc2626", to: "#f87171" };
  if (n.includes("social") || n.includes("assist") || n.includes("familiar"))
    return { icon: HandHeart, from: "#7c3aed", to: "#a78bfa" };
  if (n.includes("financ") || n.includes("tribut") || n.includes("fazenda") || n.includes("fiscal"))
    return { icon: Landmark, from: "#047857", to: "#34d399" };
  if (n.includes("agric") || n.includes("pesca") || n.includes("rural") || n.includes("abastec"))
    return { icon: Wheat, from: "#92400e", to: "#f59e0b" };
  if (n.includes("obra") || n.includes("infraestrut") || n.includes("constru"))
    return { icon: HardHat, from: "#b45309", to: "#fbbf24" };
  if (n.includes("turismo") || n.includes("turis") || n.includes("lazer"))
    return { icon: MapPin, from: "#0e7490", to: "#22d3ee" };
  if (n.includes("planej") || n.includes("gestao") || n.includes("gestão"))
    return { icon: ClipboardList, from: "#1d4ed8", to: "#60a5fa" };
  if (n.includes("esporte") || n.includes("sport"))
    return { icon: Trophy, from: "#c2410c", to: "#fb923c" };
  if (n.includes("cultur") || n.includes("arte") || n.includes("patrimonio"))
    return { icon: Music, from: "#9333ea", to: "#e879f9" };
  if (n.includes("ambient") || n.includes("ecolog") || n.includes("sustent") || n.includes("verde"))
    return { icon: Leaf, from: "#15803d", to: "#4ade80" };
  if (n.includes("transport") || n.includes("transito") || n.includes("mobilidade"))
    return { icon: Car, from: "#475569", to: "#94a3b8" };
  if (n.includes("habitacao") || n.includes("urban") || n.includes("moradia"))
    return { icon: Home, from: "#0f766e", to: "#2dd4bf" };
  if (n.includes("comunicacao") || n.includes("imprensa") || n.includes("midia"))
    return { icon: Megaphone, from: "#be185d", to: "#f472b6" };
  if (n.includes("juridic") || n.includes("procuradoria") || n.includes("legal"))
    return { icon: Scale, from: "#1e3a5f", to: "#3b82f6" };
  if (n.includes("seguranca") || n.includes("defesa") || n.includes("guarda"))
    return { icon: Shield, from: "#1e293b", to: "#64748b" };
  if (n.includes("tecnolog") || n.includes("ciencia") || n.includes("inovacao") || n.includes("digital"))
    return { icon: Cpu, from: "#1d4ed8", to: "#818cf8" };
  if (n.includes("trabalho") || n.includes("emprego") || n.includes("renda"))
    return { icon: Briefcase, from: "#374151", to: "#6b7280" };
  if (n.includes("mulher") || n.includes("igualdade") || n.includes("direito"))
    return { icon: Users, from: "#9d174d", to: "#ec4899" };
  if (n.includes("crianca") || n.includes("infancia") || n.includes("juventude") || n.includes("menor"))
    return { icon: Baby, from: "#0369a1", to: "#38bdf8" };
  if (n.includes("agua") || n.includes("saneamento") || n.includes("esgoto"))
    return { icon: Droplets, from: "#0284c7", to: "#7dd3fc" };
  if (n.includes("energia") || n.includes("eletric"))
    return { icon: Zap, from: "#a16207", to: "#facc15" };
  if (n.includes("biblioteca") || n.includes("leitura"))
    return { icon: BookOpen, from: "#4f46e5", to: "#a5b4fc" };
  if (n.includes("relacoes") || n.includes("convenio") || n.includes("exterior"))
    return { icon: Globe, from: "#0f766e", to: "#5eead4" };

  // fallback: administração
  return { icon: Building2, from: "#1e3a8a", to: "#3b82f6" };
}

const PAGE_COLS = 5;
const PAGE_ROWS = 2;
const PAGE_SIZE = PAGE_COLS * PAGE_ROWS; // 10

export default function SecretariasStrip({ secretarias }: Props) {
  const [page, setPage] = useState(0);

  if (!secretarias.length) return null;

  const totalPages = Math.ceil(secretarias.length / PAGE_SIZE);
  const visible = secretarias.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const hasPrev = page > 0;
  const hasNext = page < totalPages - 1;

  return (
    <section className="py-12 bg-white">
      <div className="container-site">

        {/* Header */}
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-3">
            <span className="w-1 h-7 rounded-full bg-brand-blue" />
            <h2 className="section-title">Secretarias Municipais</h2>
          </div>
          <div className="flex items-center gap-2">
            {/* Page arrows — only when needed */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={!hasPrev}
                  aria-label="Página anterior"
                  className="p-1.5 rounded-lg border-2 border-brand-blue/20 text-brand-blue disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-all duration-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs text-gray-400 font-medium px-1">
                  {page + 1}/{totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasNext}
                  aria-label="Próxima página"
                  className="p-1.5 rounded-lg border-2 border-brand-blue/20 text-brand-blue disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-all duration-200"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
            <Link
              href="/governo/secretarias"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-brand-blue border-2 border-brand-blue/20 px-4 py-2 rounded-xl hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-all duration-200"
            >
              Ver todas
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {visible.map((sec) => {
            const { icon: Icon, from, to } = getConfig(sec.short_name ?? sec.name);
            return (
              <Link
                key={sec.id}
                href={`/${sec.slug}`}
                className="flex flex-col items-center text-center p-4 rounded-2xl border border-gray-100 hover:border-brand-blue/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group bg-white"
              >
                {/* Icon badge */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:shadow-lg transition-all duration-200 shadow-md"
                  style={{
                    background: `linear-gradient(135deg, ${from}, ${to})`,
                  }}
                >
                  <Icon className="w-7 h-7 text-white drop-shadow-sm" strokeWidth={1.75} />
                </div>

                <span className="text-xs font-semibold text-gray-800 leading-tight line-clamp-2 tracking-tight">
                  {sec.short_name ?? sec.name}
                </span>
                <span className="text-xs text-gray-400 mt-1 line-clamp-1 hidden sm:block">
                  {sec.secretary_name}
                </span>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
