"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { NAV_LINKS, SITE } from "@/lib/constants";
import MobileMenu from "./MobileMenu";

function LiveDate() {
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const days = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const now = new Date();
    setDateStr(`${days[now.getDay()]}, ${now.getDate()} de ${months[now.getMonth()]} de ${now.getFullYear()}`);
  }, []);

  return <span className="text-sm text-gray-600">{dateStr}</span>;
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Barra superior: logo + data + redes + botões + busca */}
      <div className="border-b border-gray-200">
        <div className="container-site flex flex-wrap items-center justify-between gap-3 py-3">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Prefeitura de Feliz Deserto"
              width={200}
              height={70}
              className="h-14 w-auto object-contain"
              priority
            />
          </Link>

          {/* Data */}
          <div className="hidden md:block">
            <LiveDate />
          </div>

          {/* Redes sociais + botões + busca */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Redes sociais */}
            <div className="hidden sm:flex items-center gap-1 mr-2">
              <span className="text-xs text-gray-500 mr-1">Prefeitura nas Redes</span>
              <a href={SITE.instagram} target="_blank" rel="noopener noreferrer"
                className="w-7 h-7 flex items-center justify-center rounded bg-brand-blue text-white hover:bg-brand-blue-light transition-colors"
                aria-label="Instagram">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://www.facebook.com/prefeituradefelizdeserto" target="_blank" rel="noopener noreferrer"
                className="w-7 h-7 flex items-center justify-center rounded bg-brand-blue text-white hover:bg-brand-blue-light transition-colors"
                aria-label="Facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://www.youtube.com/@prefeituradefelizdeserto" target="_blank" rel="noopener noreferrer"
                className="w-7 h-7 flex items-center justify-center rounded bg-brand-blue text-white hover:bg-brand-blue-light transition-colors"
                aria-label="YouTube">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>

            {/* Botão Transparência */}
            <a
              href={SITE.transparencyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-green text-white text-xs font-semibold rounded hover:bg-brand-green-dark transition-colors uppercase tracking-wide"
            >
              Portal da Transparência
            </a>

            {/* Botão Fale Conosco */}
            <Link
              href="/fale-conosco"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-gold text-white text-xs font-semibold rounded hover:opacity-90 transition-colors uppercase tracking-wide"
            >
              Fale Conosco
            </Link>

            {/* Busca */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (search.trim()) window.location.href = `/noticias?q=${encodeURIComponent(search)}`;
              }}
              className="hidden md:flex items-center border border-gray-300 rounded overflow-hidden"
            >
              <input
                type="text"
                placeholder="Pesquisar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-3 py-1.5 text-sm outline-none w-36"
              />
              <button type="submit" className="bg-brand-blue text-white px-3 py-1.5 hover:bg-brand-blue-light transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded text-gray-700 hover:bg-gray-100"
              aria-label="Abrir menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Barra de navegação */}
      <nav className="bg-brand-blue hidden lg:block" aria-label="Menu principal">
        <div className="container-site">
          <ul className="flex items-center">
            <li>
              <Link
                href="/"
                className="flex items-center px-4 py-3.5 text-sm font-semibold text-white bg-brand-green hover:bg-brand-green-dark transition-colors uppercase tracking-wide"
              >
                Início
              </Link>
            </li>
            {NAV_LINKS.map((item) => (
              <li key={item.href} className="relative group">
                {item.children ? (
                  <>
                    <button className="flex items-center gap-1 px-4 py-3.5 text-sm font-medium text-white hover:bg-white/10 transition-colors uppercase tracking-wide">
                      {item.label}
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <ul className="absolute top-full left-0 w-52 bg-white shadow-lg border-t-2 border-brand-green py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-blue hover:text-white transition-colors border-b border-gray-100 last:border-0"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center px-4 py-3.5 text-sm font-medium text-white hover:bg-white/10 transition-colors uppercase tracking-wide"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
