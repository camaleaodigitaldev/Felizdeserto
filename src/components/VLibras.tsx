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

      const pin = (btn: HTMLElement) => {
        btn.style.setProperty("top", "136px", "important");
        btn.style.setProperty("bottom", "auto", "important");
        btn.style.setProperty("right", "0px", "important");
        btn.style.setProperty("position", "fixed", "important");
      };

      // Espera o botão existir, depois observa mudanças de style
      const interval = setInterval(() => {
        const btn = document.querySelector("[vw-access-button]") as HTMLElement | null;
        if (!btn) return;
        clearInterval(interval);
        pin(btn);
        const observer = new MutationObserver(() => pin(btn));
        observer.observe(btn, { attributes: true, attributeFilter: ["style"] });
      }, 100);
    };
    document.body.appendChild(script);
  }, []);

  return null;
}
