"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { getCookieConsent } from "./layout/CookieBanner";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);
  const [consent, setConsent] = useState<string | null>(null);

  // Lê o consentimento inicial e escuta mudanças (ex: usuário aceita no banner)
  useEffect(() => {
    setConsent(getCookieConsent());

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "fd_cookie_consent") setConsent(e.newValue);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    // Só rastrear se o usuário aceitou cookies de analytics
    if (consent !== "accepted") return;

    // Não rastrear a mesma rota duas vezes (StrictMode no dev)
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;

    // Não rastrear área admin/login
    if (pathname.startsWith("/admin") || pathname.startsWith("/login")) return;

    const referrer =
      typeof document !== "undefined" && document.referrer
        ? document.referrer
        : null;

    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, referrer }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname, consent]);

  return null;
}
