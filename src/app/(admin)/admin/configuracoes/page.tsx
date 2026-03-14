"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { SiteSetting } from "@/types/database";

export default function AdminConfiguracoesPage() {
  const supabase = createClient();
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from("site_settings").select("*").order("setting_group").then(({ data }) => {
      if (data) setSettings(data);
    });
  }, []);

  function updateLocal(key: string, value: string) {
    setSettings((prev) => prev.map((s) => (s.key === key ? { ...s, value } : s)));
  }

  async function saveAll() {
    setSaving(true);
    try {
      for (const s of settings) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const client = supabase as any;
        await client
          .from("site_settings")
          .update({ value: s.value, updated_at: new Date().toISOString() })
          .eq("key", s.key);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  const groups = Array.from(new Set(settings.map((s) => s.setting_group)));

  const groupLabels: Record<string, string> = {
    geral: "Informações Gerais",
    contato: "Contato",
    redes_sociais: "Redes Sociais",
    links: "Links",
    analytics: "Analytics",
    integracoes: "Integrações",
    governo: "Governo",
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configurações do Site</h1>
        <button onClick={saveAll} disabled={saving} className="btn-primary">
          {saving ? "Salvando..." : saved ? "✓ Salvo!" : "Salvar tudo"}
        </button>
      </div>

      <div className="space-y-6">
        {groups.map((group) => (
          <div key={group} className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-brand-blue text-sm uppercase tracking-wide mb-5 pb-3 border-b">
              {groupLabels[group] ?? group}
            </h2>
            <div className="space-y-4">
              {settings.filter((s) => s.setting_group === group).map((s) => (
                <div key={s.key}>
                  <label className="label-base">{s.label}</label>
                  {s.value && s.value.length > 80 ? (
                    <textarea
                      value={s.value ?? ""}
                      onChange={(e) => updateLocal(s.key, e.target.value)}
                      className="input-base resize-none"
                      rows={3}
                    />
                  ) : (
                    <input
                      type={s.key.includes("token") || s.key.includes("key") || s.key.includes("secret") ? "password" : "text"}
                      value={s.value ?? ""}
                      onChange={(e) => updateLocal(s.key, e.target.value)}
                      className="input-base"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
