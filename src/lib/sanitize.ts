export function sanitizeHtml(dirty: string | null | undefined): string {
  if (!dirty) return "";
  let html = String(dirty);
  html = html.replace(/<\s*(script|style|iframe|object|embed|form|noscript|template|svg|math)\b[\s\S]*?<\s*\/\s*\1\s*>/gi, "");
  html = html.replace(/<\s*\/?\s*(script|style|iframe|object|embed|form|noscript|template|link|meta|base|svg|math)\b[^>]*>/gi, "");
  html = html.replace(/\son[a-z0-9_-]+\s*=\s*"[^"]*"/gi, "");
  html = html.replace(/\son[a-z0-9_-]+\s*=\s*'[^']*'/gi, "");
  html = html.replace(/\son[a-z0-9_-]+\s*=\s*[^\s>]+/gi, "");
  const badUrl = /^\s*(javascript:|vbscript:|data:(?!image\/(?:png|jpe?g|gif|webp|svg\+xml)))/i;
  html = html.replace(/\b(href|src|xlink:href)\s*=\s*"([^"]*)"/gi, (m, attr, val) => (badUrl.test(val) ? `${attr}="#"` : m));
  html = html.replace(/\b(href|src|xlink:href)\s*=\s*'([^']*)'/gi, (m, attr, val) => (badUrl.test(val) ? `${attr}='#'` : m));
  html = html.replace(/\sstyle\s*=\s*"[^"]*(expression\s*\(|javascript:)[^"]*"/gi, "");
  html = html.replace(/\sstyle\s*=\s*'[^']*(expression\s*\(|javascript:)[^']*'/gi, "");
  return html;
}
