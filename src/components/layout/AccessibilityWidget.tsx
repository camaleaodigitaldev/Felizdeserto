"use client";

import { useState, useEffect, useRef } from "react";

const A11Y_KEY = "fd_a11y";
const POS_KEY  = "fd_a11y_pos";

const WIDGET_SIZE = 40; // px
const EDGE_GAP    = 16; // px do lado

interface A11yState {
  contrast: boolean;
  grayscale: boolean;
  invert: boolean;
  highlightLinks: boolean;
  fontSize: number; // -2 .. +3
}

interface WidgetPos {
  y: number;
  side: "left" | "right";
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
  const [open, setOpen]   = useState(false);
  const [state, setState] = useState<A11yState>(DEFAULT);
  const [pos, setPos]     = useState<WidgetPos | null>(null);
  const [dragging, setDragging] = useState(false);
  const outerRef = useRef<HTMLDivElement>(null);
  const drag     = useRef({ active: false, startX: 0, startY: 0, origY: 0, moved: false });

  /* ── Carregar preferências de acessibilidade ─────────────────── */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(A11Y_KEY);
      const initial = saved ? { ...DEFAULT, ...JSON.parse(saved) } : DEFAULT;
      setState(initial);
      applyAll(initial);
    } catch { /* ignore */ }
  }, []);

  /* ── Carregar posição salva (ou usar padrão: centro / esquerda) ─ */
  useEffect(() => {
    let saved: WidgetPos | null = null;
    try {
      const s = localStorage.getItem(POS_KEY);
      if (s) saved = JSON.parse(s);
    } catch {}
    setPos(saved ?? {
      y: Math.round(window.innerHeight / 2 - WIDGET_SIZE / 2),
      side: "left",
    });
  }, []);

  /* ── Fechar ao clicar fora ───────────────────────────────────── */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (outerRef.current && !outerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  /* ── Acessibilidade ─────────────────────────────────────────── */
  function update(next: A11yState) {
    setState(next);
    try { localStorage.setItem(A11Y_KEY, JSON.stringify(next)); } catch {}
    applyAll(next);
  }
  function toggle(key: keyof Omit<A11yState, "fontSize">) {
    update({ ...state, [key]: !state[key] });
  }
  function changeFontSize(delta: number) {
    update({ ...state, fontSize: Math.max(-2, Math.min(3, state.fontSize + delta)) });
  }

  /* ── Salvar posição ─────────────────────────────────────────── */
  function savePos(p: WidgetPos) {
    setPos(p);
    try { localStorage.setItem(POS_KEY, JSON.stringify(p)); } catch {}
  }

  /* ── Drag (pointer events, funciona em touch e mouse) ──────── */
  function onPointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      origY: pos?.y ?? 0,
      moved: false,
    };
  }

  function onPointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    if (!drag.current.active) return;
    const dy = e.clientY - drag.current.startY;
    const dx = Math.abs(e.clientX - drag.current.startX);
    if (Math.abs(dy) > 5 || dx > 5) drag.current.moved = true;
    if (!drag.current.moved) return;

    setDragging(true);
    const newY = Math.max(8, Math.min(window.innerHeight - WIDGET_SIZE - 8, drag.current.origY + dy));
    setPos(p => p ? { ...p, y: newY } : null);
    e.preventDefault();
  }

  function onPointerUp(e: React.PointerEvent<HTMLButtonElement>) {
    if (!drag.current.active) return;
    drag.current.active = false;
    setDragging(false);

    if (!drag.current.moved) {
      // Era um tap — abre/fecha o painel
      setOpen(o => !o);
      return;
    }

    // Snapa para o lado mais próximo
    const side: "left" | "right" = e.clientX > window.innerWidth / 2 ? "right" : "left";
    const newY = Math.max(8, Math.min(window.innerHeight - WIDGET_SIZE - 8, pos?.y ?? 0));
    savePos({ y: newY, side });
  }

  const isDefault =
    !state.contrast && !state.grayscale && !state.invert &&
    !state.highlightLinks && state.fontSize === 0;

  const items = [
    {
      label: "Aumentar fonte",
      action: () => changeFontSize(1),
      disabled: state.fontSize >= 3,
      active: false,
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />,
    },
    {
      label: "Diminuir fonte",
      action: () => changeFontSize(-1),
      disabled: state.fontSize <= -2,
      active: false,
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />,
    },
    {
      label: "Preto e branco",
      action: () => toggle("grayscale"),
      disabled: false,
      active: state.grayscale,
      icon: <><circle cx="12" cy="12" r="9" /><path d="M12 3a9 9 0 0 1 0 18V3z" fill="currentColor" stroke="none" /></>,
    },
    {
      label: "Inverter cores",
      action: () => toggle("invert"),
      disabled: false,
      active: state.invert,
      icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1M4.22 4.22l.707.707m12.02 12.02.707.707M3 12h1m16 0h1M4.927 19.073l.707-.707M18.366 4.634l.707-.707" /><circle cx="12" cy="12" r="4" /></>,
    },
    {
      label: "Destacar links",
      action: () => toggle("highlightLinks"),
      disabled: false,
      active: state.highlightLinks,
      icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 0 0-5.656 0l-4 4a4 4 0 1 0 5.656 5.656l1.102-1.101" /><path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 0 0 5.656 0l4-4a4 4 0 0 0-5.656-5.656l-1.1 1.1" /></>,
    },
    {
      label: "Redefinir",
      action: () => update(DEFAULT),
      disabled: isDefault,
      active: false,
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15" />,
    },
  ];

  // Esconde até carregar posição (evita flash no lado errado)
  if (!pos) return null;

  const onRight = pos.side === "right";

  return (
    <div
      ref={outerRef}
      style={{
        position: "fixed",
        top: `${pos.y}px`,
        [onRight ? "right" : "left"]: `${EDGE_GAP}px`,
        [onRight ? "left" : "right"]: "auto",
        zIndex: 60,
      }}
    >
      {/* Painel de opções — abre para o lado oposto ao da borda */}
      {open && (
        <div
          className={`absolute top-0 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-52 animate-fade-in ${
            onRight ? "right-12" : "left-12"
          }`}
          style={{ maxHeight: "calc(100vh - 32px)", overflowY: "auto" }}
        >
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
                    ${item.active ? "bg-blue-50 text-brand-blue font-semibold" : "text-gray-700 hover:bg-gray-50"}
                    ${item.disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                  `}
                >
                  <span className={item.active ? "text-brand-blue" : "text-gray-400"}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      {item.icon}
                    </svg>
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

      {/* Botão flutuante — drag + tap */}
      <button
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="w-10 h-10 bg-[#1351b4]/80 text-white rounded-full flex items-center justify-center shadow-md hover:bg-[#1351b4] transition-colors select-none"
        style={{
          cursor: dragging ? "grabbing" : "grab",
          touchAction: "none",
        }}
        aria-label="Opções de acessibilidade"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="4" r="2" />
          <path d="M10.5 7.5C9 7.5 8 8.5 8 10v4l2 .5V22h4V14.5l2-.5V10c0-1.5-1-2.5-2.5-2.5h-3z"/>
        </svg>
      </button>
    </div>
  );
}
