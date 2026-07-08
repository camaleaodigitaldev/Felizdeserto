import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitiza HTML vindo do editor (TipTap) antes de renderizar com
 * dangerouslySetInnerHTML. Remove <script>, iframes, handlers de
 * evento (onclick, etc.) e URLs perigosas (javascript:), preservando
 * a formatação normal do conteúdo.
 */
export function sanitizeHtml(dirty: string | null | undefined): string {
  if (!dirty) return "";
  return DOMPurify.sanitize(dirty, { USE_PROFILES: { html: true } });
}
