"use client";

import { useEffect } from "react";

interface Props {
  url: string;
  title: string;
  filename?: string | null;
  onClose: () => void;
}

export default function PdfViewerModal({ url, title, filename, onClose }: Props) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col" role="dialog" aria-modal="true" aria-label={title}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative flex flex-col w-full h-full max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-900 border-b border-white/10 flex-shrink-0 z-10">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center flex-shrink-0"
            aria-label="Fechar"
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <p className="text-white text-sm font-semibold truncate flex-1">{title}</p>

          <a
            href={url}
            download={filename ?? true}
            className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Baixar
          </a>
        </div>

        {/* PDF iframe */}
        <iframe
          src={url}
          title={title}
          className="flex-1 w-full bg-gray-100"
        />
      </div>
    </div>
  );
}
