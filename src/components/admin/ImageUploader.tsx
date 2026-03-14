"use client";

import { useRef, useState } from "react";
import Image from "next/image";

interface Props {
  value?: string;
  onChange: (url: string) => void;
  bucket?: "news-images" | "editais-pdfs" | "banners" | "profiles";
  accept?: string;
  label?: string;
}

export default function ImageUploader({
  value,
  onChange,
  bucket = "news-images",
  accept = "image/jpeg,image/png,image/webp",
  label = "Imagem de capa",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");
    setUploading(true);
    try {
      // Get signed URL
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          bucket,
        }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? "Erro ao obter URL de upload");
      }

      const { signedUrl, publicUrl } = await res.json();

      // Upload directly to Supabase Storage
      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadRes.ok) throw new Error("Falha no upload do arquivo");

      onChange(publicUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro no upload");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="label-base">{label}</label>

      {value ? (
        <div className="relative">
          <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-gray-200">
            <Image src={value} alt="Preview" fill className="object-cover" sizes="500px" />
          </div>
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="btn-outline text-sm"
              disabled={uploading}
            >
              Trocar imagem
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-sm text-red-500 hover:text-red-700"
              disabled={uploading}
            >
              Remover
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-brand-blue hover:bg-brand-blue/5 transition-colors"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-gray-500">
              <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-sm">Enviando...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm font-medium">Clique para fazer upload</p>
              <p className="text-xs">PNG, JPG, WEBP até 10MB</p>
            </div>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
