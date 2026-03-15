"use client";

import { useEffect } from "react";

export default function VLibras() {
  useEffect(() => {
    // Evita duplicação em hot-reload
    if (document.querySelector("[vw]")) return;

    // <div vw class="enabled">
    const container = document.createElement("div");
    container.setAttribute("vw", "");
    container.className = "enabled";

    // <div vw-access-button class="active">
    const accessBtn = document.createElement("div");
    accessBtn.setAttribute("vw-access-button", "");
    accessBtn.className = "active";

    // <div vw-plugin-wrapper>
    const pluginWrapper = document.createElement("div");
    pluginWrapper.setAttribute("vw-plugin-wrapper", "");

    // <div class="vw-plugin-top-wrapper">
    const topWrapper = document.createElement("div");
    topWrapper.className = "vw-plugin-top-wrapper";

    pluginWrapper.appendChild(topWrapper);
    container.appendChild(accessBtn);
    container.appendChild(pluginWrapper);
    document.body.appendChild(container);

    // Carrega o script do VLibras
    const script = document.createElement("script");
    script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    script.async = true;
    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new (window as any).VLibras.Widget("https://vlibras.gov.br/app");

      const pin = () => {
        const vw = document.querySelector("[vw]") as HTMLElement | null;
        const btn = document.querySelector("[vw-access-button]") as HTMLElement | null;
        if (vw) {
          vw.style.setProperty("position", "fixed", "important");
          vw.style.setProperty("bottom", "0", "important");
          vw.style.setProperty("top", "auto", "important");
          vw.style.setProperty("right", "0", "important");
        }
        if (btn) {
          btn.style.setProperty("position", "fixed", "important");
          btn.style.setProperty("bottom", "24px", "important");
          btn.style.setProperty("top", "auto", "important");
          btn.style.setProperty("right", "16px", "important");
          btn.style.setProperty("left", "auto", "important");
        }
      };

      // Espera os elementos existirem, depois observa mudanças de style
      const interval = setInterval(() => {
        const btn = document.querySelector("[vw-access-button]") as HTMLElement | null;
        if (!btn) return;
        clearInterval(interval);
        pin();
        const observer = new MutationObserver(pin);
        observer.observe(document.querySelector("[vw]")!, { attributes: true, subtree: true, attributeFilter: ["style"] });
      }, 100);
    };
    document.body.appendChild(script);
  }, []);

  return null;
}
