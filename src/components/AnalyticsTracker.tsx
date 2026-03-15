"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
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
  }, [pathname]);

  return null;
}
