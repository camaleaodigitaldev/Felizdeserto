"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { NAV_LINKS, SITE } from "@/lib/constants";
import MobileMenu from "./MobileMenu";
import { createClient } from "@/lib/supabase/client";

const A11Y_KEY = "fd_a11y";
interface A11yState { contrast: boolean; hideImages: boolean; grayscale: boolean; }
const A11Y_DEFAULT: A11yState = { contrast: false, hideImages: false, grayscale: false };

function applyA11yClasses(s: A11yState) {
  document.documentElement.classList.toggle("a11y-contrast", s.contrast);
  document.documentElement.classList.toggle("a11y-hide-images", s.hideImages);
  document.documentElement.classList.toggle("a11y-grayscale", s.grayscale);
}

function LiveDate() {
  const [dateStr, setDateStr] = useState("");
  useEffect(() => {
    const days = ["Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado"];
    const months = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
    const now = new Date();
    setDateStr(`${days[now.getDay()]}\n${now.getDate()} de ${months[now.getMonth()]} de ${now.getFullYear()}`);
  }, []);
  if (!dateStr) return null;
  const [weekday, rest] = dateStr.split("\n");
  return (
    <div className="hidden md:block text-sm leading-tight">
      <div className="font-semibold text-gray-700">{weekday}</div>
      <div className="text-xs text-gray-400">{rest}</div>
    </div>
  );
}

interface Secretaria {
  id: string;
  name: string;
  slug: string;
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const pathname = usePathname();
  const [secretarias, setSecretarias] = useState<Secretaria[]>([]);
  const [a11y, setA11y] = useState<A11yState>(A11Y_DEFAULT);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("secretarias")
      .select("id, name, slug")
      .eq("is_active", true)
      .order("display_order")
      .then(({ data }) => {
        if (data) setSecretarias(data as Secretaria[]);
      });
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(A11Y_KEY);
      const initial = saved ? { ...A11Y_DEFAULT, ...JSON.parse(saved) } : A11Y_DEFAULT;
      setA11y(initial);
      applyA11yClasses(initial);
    } catch { /* ignore */ }
  }, []);

  function toggleA11y(key: keyof A11yState) {
    setA11y((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(A11Y_KEY, JSON.stringify(next));
      applyA11yClasses(next);
      return next;
    });
  }

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      {/* ── Barra superior ── */}
      <div className="bg-white">
        <div className="container-site flex items-center justify-between py-3 gap-4">

          {/* Logo + Divisor + Data */}
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image src="https://desohrdjqujmmplawntj.supabase.co/storage/v1/object/public/banners/logo-2022feliznovo.png" alt="Prefeitura de Feliz Deserto" width={220} height={72} className="h-14 w-auto object-contain" priority />
            </Link>
            <div className="hidden md:block w-px h-9 bg-gray-200" />
            <LiveDate />
          </div>

          {/* Direita: acessibilidade + redes + botões + busca */}
          <div className="hidden md:flex flex-col items-end gap-2.5">
            {/* Linha 1: acessibilidade + redes */}
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1.5" role="toolbar" aria-label="Opções de acessibilidade">
                <span>Acessibilidade</span>
                {/* Alto contraste */}
                <button
                  onClick={() => toggleA11y("contrast")}
                  aria-pressed={a11y.contrast}
                  aria-label={a11y.contrast ? "Desativar alto contraste" : "Alto contraste"}
                  title={a11y.contrast ? "Desativar alto contraste" : "Alto contraste"}
                  className={`p-1 rounded-lg transition-colors ${a11y.contrast ? "bg-brand-blue text-white" : "hover:bg-gray-100 hover:text-brand-blue"}`}
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 2a10 10 0 0 1 0 20V2z"/>
                  </svg>
                </button>
                {/* Ocultar imagens */}
                <button
                  onClick={() => toggleA11y("hideImages")}
                  aria-pressed={a11y.hideImages}
                  aria-label={a11y.hideImages ? "Exibir imagens" : "Ocultar imagens"}
                  title={a11y.hideImages ? "Exibir imagens" : "Ocultar imagens"}
                  className={`p-1 rounded-lg transition-colors ${a11y.hideImages ? "bg-brand-blue text-white" : "hover:bg-gray-100 hover:text-brand-blue"}`}
                >
                  {a11y.hideImages ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="2" y1="2" x2="22" y2="22"/><path d="M10.41 10.41a2 2 0 1 0 2.83 2.83"/><path d="M6.37 6.37A9.87 9.87 0 0 0 3 12s3 7 9 7a9.86 9.86 0 0 0 5.63-1.75"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c6 0 9 8 9 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                    </svg>
                  )}
                </button>
                {/* Escala de cinza */}
                <button
                  onClick={() => toggleA11y("grayscale")}
                  aria-pressed={a11y.grayscale}
                  aria-label={a11y.grayscale ? "Desativar escala de cinza" : "Escala de cinza"}
                  title={a11y.grayscale ? "Desativar escala de cinza" : "Escala de cinza"}
                  className={`p-1 rounded-lg transition-colors ${a11y.grayscale ? "bg-brand-blue text-white" : "hover:bg-gray-100 hover:text-brand-blue"}`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 2a10 10 0 0 1 0 20" fill="currentColor" fillOpacity="0.25" stroke="none"/>
                  </svg>
                </button>
              </span>
              <div className="w-px h-3.5 bg-gray-200" />
              <span className="flex items-center gap-1.5">
                <span>Redes Sociais</span>
                <a href="https://www.facebook.com/prefeituradefelizdeserto" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-1 rounded-lg hover:bg-gray-100 hover:text-brand-blue transition-colors">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-1 rounded-lg hover:bg-gray-100 hover:text-brand-blue transition-colors">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="https://www.youtube.com/@prefeituradefelizdeserto" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="p-1 rounded-lg hover:bg-gray-100 hover:text-brand-blue transition-colors">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </span>
            </div>
            {/* Linha 2: botões + busca */}
            <div className="flex items-center gap-2">
              <a href={SITE.transparencyUrl} target="_blank" rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-brand-green text-white text-xs font-semibold rounded-xl hover:bg-brand-green-dark transition-all duration-200 shadow-sm hover:shadow">
                Portal da Transparência
              </a>
              <Link href="/fale-conosco"
                className="px-3.5 py-1.5 bg-amber-500 text-white text-xs font-semibold rounded-xl hover:bg-amber-600 transition-all duration-200 shadow-sm hover:shadow">
                Fale Conosco
              </Link>
              <form onSubmit={(e) => { e.preventDefault(); if (search.trim()) window.location.href = `/noticias?q=${encodeURIComponent(search)}`; }}
                className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50 focus-within:border-brand-blue focus-within:bg-white focus-within:shadow-sm transition-all">
                <input type="text" placeholder="Pesquisar..." value={search} onChange={(e) => setSearch(e.target.value)}
                  className="px-3 py-1.5 text-sm outline-none w-36 bg-transparent text-gray-700 placeholder-gray-400" />
                <button type="submit" className="bg-brand-blue text-white px-3 py-1.5 hover:bg-brand-blue-light transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </button>
              </form>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors" aria-label="Abrir menu">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Barra de navegação ── */}
      <nav className="bg-brand-blue hidden md:block" aria-label="Menu principal">
        <div className="container-site">
          <ul className="flex items-stretch">
            <li>
              <Link href="/"
                className={`flex items-center px-5 py-3.5 text-sm font-semibold tracking-tight transition-colors ${pathname === "/" ? "bg-white/20 text-white" : "text-white/80 hover:text-white hover:bg-white/10"}`}>
                Início
              </Link>
            </li>
            {NAV_LINKS.map((item, index) => (
              <>
                <li key={item.href} className="relative group">
                  {item.children ? (
                    <>
                      <button className="flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors h-full">
                        {item.label}
                        <svg className="w-3 h-3 mt-0.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
                        </svg>
                      </button>
                      <ul className="absolute top-full left-0 w-52 bg-white rounded-2xl shadow-xl border border-gray-100/80 py-2 mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link href={child.href}
                              className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-brand-blue transition-colors rounded-lg mx-1">
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <Link href={item.href}
                      className={`flex items-center px-4 py-3.5 text-sm font-medium tracking-tight transition-colors h-full ${pathname === item.href ? "bg-white/20 text-white" : "text-white/80 hover:text-white hover:bg-white/10"}`}>
                      {item.label}
                    </Link>
                  )}
                </li>

                {/* Secretarias vem logo após Governo (index 0) */}
                {index === 0 && secretarias.length > 0 && (
                  <li key="secretarias" className="relative group">
                    <button className="flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors h-full">
                      Secretarias
                      <svg className="w-3 h-3 mt-0.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
                      </svg>
                    </button>
                    <ul className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-gray-100/80 py-2 mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <li>
                        <Link href="/governo/secretarias"
                          className="block px-4 py-2.5 text-sm font-semibold text-brand-blue hover:bg-blue-50 transition-colors rounded-lg mx-1 mb-1 border-b border-gray-100 pb-3">
                          Ver todas as Secretarias
                        </Link>
                      </li>
                      {secretarias.map((sec) => (
                        <li key={sec.id}>
                          <Link href={`/governo/secretarias/${sec.slug}`}
                            className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-brand-blue transition-colors rounded-lg mx-1">
                            {sec.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                )}
              </>
            ))}
          </ul>
        </div>
      </nav>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} secretarias={secretarias} />


    </header>
  );
}
