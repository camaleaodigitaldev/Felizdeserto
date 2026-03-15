"use client";

import { useState, useEffect, useRef } from "react";

const A11Y_KEY = "fd_a11y";

interface A11yState {
  contrast: boolean;
  grayscale: boolean;
  invert: boolean;
  highlightLinks: boolean;
  fontSize: number; // -2 .. +3
}

const DEFAULT: A11yState = {
  contrast: false,
  grayscale: false,
  invert: false,
  highlightLinks: false,
  fontSize: 0,
};

function applyAll(s: A11yState) {
  const html = document.documentElement;
  html.classList.toggle("a11y-contrast", s.contrast);
  html.classList.toggle("a11y-grayscale", s.grayscale);
  html.classList.toggle("a11y-invert", s.invert);
  html.classList.toggle("a11y-links", s.highlightLinks);
  if (s.fontSize === 0) {
    html.style.removeProperty("font-size");
  } else {
    html.style.fontSize = `${100 + s.fontSize * 10}%`;
  }
}

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<A11yState>(DEFAULT);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(A11Y_KEY);
      const initial = saved ? { ...DEFAULT, ...JSON.parse(saved) } : DEFAULT;
      setState(initial);
      applyAll(initial);
    } catch { /* ignore */ }
  }, []);

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function update(next: A11yState) {
    setState(next);
    try { localStorage.setItem(A11Y_KEY, JSON.stringify(next)); } catch { /* ignore */ }
    applyAll(next);
  }

  function toggle(key: keyof Omit<A11yState, "fontSize">) {
    update({ ...state, [key]: !state[key] });
  }

  function changeFontSize(delta: number) {
    const next = Math.max(-2, Math.min(3, state.fontSize + delta));
    update({ ...state, fontSize: next });
  }

  const isDefault =
    !state.contrast &&
    !state.grayscale &&
    !state.invert &&
    !state.highlightLinks &&
    state.fontSize === 0;

  const items = [
    {
      label: "Aumentar fonte",
      action: () => changeFontSize(1),
      disabled: state.fontSize >= 3,
      active: false,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      label: "Diminuir fonte",
      action: () => changeFontSize(-1),
      disabled: state.fontSize <= -2,
      active: false,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
        </svg>
      ),
    },
    {
      label: "Preto e branco",
      action: () => toggle("grayscale"),
      disabled: false,
      active: state.grayscale,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3a9 9 0 0 1 0 18V3z" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      label: "Inverter cores",
      action: () => toggle("invert"),
      disabled: false,
      active: state.invert,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1M4.22 4.22l.707.707m12.02 12.02.707.707M3 12h1m16 0h1M4.927 19.073l.707-.707M18.366 4.634l.707-.707" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      ),
    },
    {
      label: "Destacar links",
      action: () => toggle("highlightLinks"),
      disabled: false,
      active: state.highlightLinks,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 0 0-5.656 0l-4 4a4 4 0 1 0 5.656 5.656l1.102-1.101" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 0 0 5.656 0l4-4a4 4 0 0 0-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
    },
    {
      label: "Redefinir",
      action: () => update(DEFAULT),
      disabled: isDefault,
      active: false,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15" />
        </svg>
      ),
    },
  ];

  return (
    <div ref={ref} className="fixed bottom-[84px] right-1 z-[60] flex items-end justify-end">
      {/* Painel — abre para cima e para a esquerda */}
      {open && (
        <div className="absolute top-14 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-52 animate-fade-in">
          <div className="bg-brand-blue px-4 py-2.5 flex items-center gap-2">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-1 5h2l1 4 3 1-1 2-3-1v6h-2v-6l-3 1-1-2 3-1 1-4z"/>
            </svg>
            <span className="text-white text-xs font-semibold tracking-wide">Acessibilidade</span>
          </div>
          <ul className="py-1">
            {items.map((item) => (
              <li key={item.label}>
                <button
                  onClick={item.action}
                  disabled={item.disabled}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                    ${item.active
                      ? "bg-blue-50 text-brand-blue font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                    }
                    ${item.disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                  `}
                >
                  <span className={item.active ? "text-brand-blue" : "text-gray-400"}>
                    {item.icon}
                  </span>
                  {item.label}
                  {item.active && (
                    <svg className="w-3.5 h-3.5 ml-auto text-brand-blue shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Botão flutuante — mesmo estilo do VLibras */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-12 h-12 bg-[#1351b4] text-white rounded-xl flex items-center justify-center shadow-md hover:bg-[#0e3d8a] transition-colors"
        aria-label="Opções de acessibilidade"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="4" r="2" />
          <path d="M10.5 7.5C9 7.5 8 8.5 8 10v4l2 .5V22h4V14.5l2-.5V10c0-1.5-1-2.5-2.5-2.5h-3z"/>
          <path d="M9 10h6" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}
