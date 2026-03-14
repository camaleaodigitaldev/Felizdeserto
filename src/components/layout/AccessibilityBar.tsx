"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "fd_a11y";

interface A11yState {
  contrast: boolean;
  hideImages: boolean;
  grayscale: boolean;
}

const DEFAULT: A11yState = { contrast: false, hideImages: false, grayscale: false };

function loadState(): A11yState {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT;
  } catch {
    return DEFAULT;
  }
}

function applyClasses(state: A11yState) {
  const html = document.documentElement;
  html.classList.toggle("a11y-contrast", state.contrast);
  html.classList.toggle("a11y-hide-images", state.hideImages);
  // grayscale is rendered as an overlay div — no class needed
}

// ── Icons ──────────────────────────────────────────────────

function IconContrast({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M12 2a10 10 0 0 1 0 20V2z" fill={active ? "currentColor" : "currentColor"} fillOpacity={active ? 1 : 0.5} />
    </svg>
  );
}

function IconHideImages({ active }: { active: boolean }) {
  return active ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="2" y1="2" x2="22" y2="22" />
      <path d="M10.41 10.41a2 2 0 1 0 2.83 2.83" />
      <path d="M6.37 6.37A9.87 9.87 0 0 0 3 12s3 7 9 7a9.86 9.86 0 0 0 5.63-1.75" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c6 0 9 8 9 8a18.5 18.5 0 0 1-2.16 3.19" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function IconGrayscale() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2v20M2 12h20" strokeOpacity="0.4" />
      <path d="M12 2a10 10 0 0 1 0 20" fill="currentColor" fillOpacity="0.15" />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────

export default function AccessibilityBar() {
  const [state, setState] = useState<A11yState>(DEFAULT);
  const [mounted, setMounted] = useState(false);

  // Hydrate from localStorage after mount
  useEffect(() => {
    const saved = loadState();
    setState(saved);
    applyClasses(saved);
    setMounted(true);
  }, []);

  function toggle(key: keyof A11yState) {
    setState((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      applyClasses(next);
      return next;
    });
  }

  const buttons: {
    key: keyof A11yState;
    label: string;
    labelActive: string;
    icon: (active: boolean) => React.ReactNode;
  }[] = [
    {
      key: "contrast",
      label: "Alto contraste",
      labelActive: "Desativar alto contraste",
      icon: (a) => <IconContrast active={a} />,
    },
    {
      key: "hideImages",
      label: "Ocultar imagens",
      labelActive: "Exibir imagens",
      icon: (a) => <IconHideImages active={a} />,
    },
    {
      key: "grayscale",
      label: "Escala de cinza",
      labelActive: "Desativar escala de cinza",
      icon: () => <IconGrayscale />,
    },
  ];

  return (
    <>
      {/* Grayscale overlay — mix-blend-mode: color is safe for sticky/fixed elements */}
      {mounted && state.grayscale && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99998,
            pointerEvents: "none",
            background: "#fff",
            mixBlendMode: "color",
          }}
        />
      )}

      {/* Bar */}
      <div
        role="region"
        aria-label="Acessibilidade Visual"
        className="w-full bg-gray-100 border-b border-gray-200 py-1.5 px-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-end gap-3">
          <span className="text-xs text-gray-400 font-medium tracking-wide select-none hidden sm:inline">
            Acessibilidade Visual
          </span>

          <div className="flex items-center gap-1" role="toolbar" aria-label="Opções de acessibilidade">
            {buttons.map(({ key, label, labelActive, icon }) => {
              const active = state[key];
              return (
                <button
                  key={key}
                  onClick={() => toggle(key)}
                  aria-pressed={active}
                  aria-label={active ? labelActive : label}
                  title={active ? labelActive : label}
                  className={`
                    inline-flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-150
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-1
                    ${active
                      ? "bg-brand-blue text-white shadow-sm"
                      : "text-gray-400 hover:text-gray-700 hover:bg-gray-200"
                    }
                  `}
                >
                  {icon(active)}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
