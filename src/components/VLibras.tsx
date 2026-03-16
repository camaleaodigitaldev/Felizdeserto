"use client";

import { useEffect } from "react";

const VL_POS_KEY  = "fd_vlibras_pos";
const WIDGET_SIZE = 48;
const EDGE_GAP    = 16;

export default function VLibras() {
  useEffect(() => {
    if (document.querySelector("[vw]")) return;

    /* ── Estrutura do VLibras ──────────────────────────────────── */
    const container   = document.createElement("div");
    container.setAttribute("vw", "");
    container.className = "enabled";

    const accessBtn = document.createElement("div");
    accessBtn.setAttribute("vw-access-button", "");
    accessBtn.className = "active";

    const pluginWrapper = document.createElement("div");
    pluginWrapper.setAttribute("vw-plugin-wrapper", "");
    const topWrapper = document.createElement("div");
    topWrapper.className = "vw-plugin-top-wrapper";
    pluginWrapper.appendChild(topWrapper);

    container.appendChild(accessBtn);
    container.appendChild(pluginWrapper);
    document.body.appendChild(container);

    /* ── Estado de posição (carregado do localStorage) ─────────── */
    let vlPos: { y: number; side: "left" | "right" } = {
      y: Math.round(window.innerHeight / 2 - WIDGET_SIZE / 2),
      side: "right",
    };
    try {
      const saved = localStorage.getItem(VL_POS_KEY);
      if (saved) vlPos = JSON.parse(saved);
    } catch {}

    /* ── Função que aplica posição ao botão do VLibras ─────────── */
    const pin = () => {
      const vw  = document.querySelector("[vw]")                as HTMLElement | null;
      const btn = document.querySelector("[vw-access-button]")  as HTMLElement | null;

      if (vw) {
        vw.style.setProperty("position", "fixed",  "important");
        vw.style.setProperty("bottom",   "0",      "important");
        vw.style.setProperty("top",      "auto",   "important");
        vw.style.setProperty(vlPos.side === "right" ? "right" : "left", "0",    "important");
        vw.style.setProperty(vlPos.side === "right" ? "left"  : "right", "auto", "important");
      }
      if (btn) {
        btn.style.setProperty("position", "fixed",              "important");
        btn.style.setProperty("top",      `${vlPos.y}px`,       "important");
        btn.style.setProperty("bottom",   "auto",               "important");
        btn.style.setProperty(vlPos.side === "right" ? "right" : "left", `${EDGE_GAP}px`, "important");
        btn.style.setProperty(vlPos.side === "right" ? "left"  : "right", "auto",          "important");
        btn.style.setProperty("cursor",   "grab",               "important");
        btn.style.setProperty("touch-action", "none",           "important");
      }
    };

    /* ── Script do VLibras ─────────────────────────────────────── */
    const script   = document.createElement("script");
    script.src     = "https://vlibras.gov.br/app/vlibras-plugin.js";
    script.async   = true;
    script.onload  = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new (window as any).VLibras.Widget("https://vlibras.gov.br/app");

      /* Espera o botão existir, depois aplica posição e drag */
      const interval = setInterval(() => {
        const btn = document.querySelector("[vw-access-button]") as HTMLElement | null;
        if (!btn) return;
        clearInterval(interval);
        pin();

        /* MutationObserver para manter posição mesmo após resets do VLibras */
        const observer = new MutationObserver(pin);
        observer.observe(document.querySelector("[vw]")!, {
          attributes: true, subtree: true, attributeFilter: ["style"],
        });

        /* ── Drag no botão do VLibras ─────────────────────────── */
        // Usamos listeners no document (sem setPointerCapture) para não
        // interferir nos handlers de clique nativos do VLibras.
        const dragState = { active: false, startX: 0, startY: 0, origY: 0, moved: false };

        const onMove = (e: PointerEvent) => {
          if (!dragState.active) return;
          const dy = e.clientY - dragState.startY;
          const dx = Math.abs(e.clientX - dragState.startX);
          if (Math.abs(dy) > 5 || dx > 5) dragState.moved = true;
          if (!dragState.moved) return;

          vlPos = {
            ...vlPos,
            y: Math.max(8, Math.min(window.innerHeight - WIDGET_SIZE - 8, dragState.origY + dy)),
          };
          pin();
          e.preventDefault();
        };

        const onUp = (e: PointerEvent) => {
          if (!dragState.active) return;
          dragState.active = false;
          document.removeEventListener("pointermove", onMove);
          document.removeEventListener("pointerup", onUp);
          btn.style.setProperty("cursor", "grab", "important");

          if (!dragState.moved) return; // tap — deixa o VLibras abrir normalmente

          // Depois de arrastar, cancela o click que o browser dispara em seguida
          btn.addEventListener("click", (ev) => ev.stopImmediatePropagation(), { once: true, capture: true });

          /* Snapa para o lado mais próximo */
          const side: "left" | "right" = e.clientX > window.innerWidth / 2 ? "right" : "left";
          vlPos = {
            side,
            y: Math.max(8, Math.min(window.innerHeight - WIDGET_SIZE - 8, vlPos.y)),
          };
          try { localStorage.setItem(VL_POS_KEY, JSON.stringify(vlPos)); } catch {}
          pin();
        };

        btn.addEventListener("pointerdown", (e) => {
          dragState.active = true;
          dragState.startX = (e as PointerEvent).clientX;
          dragState.startY = (e as PointerEvent).clientY;
          dragState.origY  = vlPos.y;
          dragState.moved  = false;
          btn.style.setProperty("cursor", "grabbing", "important");
          document.addEventListener("pointermove", onMove, { passive: false });
          document.addEventListener("pointerup", onUp);
        });
      }, 100);
    };

    document.body.appendChild(script);
  }, []);

  return null;
}
