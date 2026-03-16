"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const CONSENT_KEY = "fd_cookie_consent";

export type CookieConsent = "accepted" | "rejected" | null;

export function getCookieConsent(): CookieConsent {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(CONSENT_KEY);
  if (v === "accepted" || v === "rejected") return v;
  return null;
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getCookieConsent()) setVisible(true);
  }, []);

  if (!visible) return null;

  const choose = (value: "accepted" | "rejected") => {
    localStorage.setItem(CONSENT_KEY, value);
    setVisible(false);
    // Dispara evento para que outros componentes na mesma aba reajam
    window.dispatchEvent(new StorageEvent("storage", { key: CONSENT_KEY, newValue: value }));
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg"
      role="dialog"
      aria-label="Aviso de privacidade e cookies"
    >
      <div className="container-site py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Ícone + texto */}
        <div className="flex items-start gap-3 flex-1">
          <svg
            className="w-5 h-5 text-brand-blue mt-0.5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <p className="text-sm text-gray-600 leading-relaxed">
            Usamos cookies para melhorar sua experiência e analisar o tráfego do site.
            Saiba mais em nossa{" "}
            <Link
              href="/politica-privacidade"
              className="text-brand-blue underline underline-offset-2 hover:text-blue-800"
            >
              Política de Privacidade
            </Link>
            .
          </p>
        </div>

        {/* Botões */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => choose("rejected")}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Somente essenciais
          </button>
          <button
            onClick={() => choose("accepted")}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-blue rounded-lg hover:bg-blue-800 transition-colors"
          >
            Aceitar todos
          </button>
        </div>
      </div>
    </div>
  );
}
