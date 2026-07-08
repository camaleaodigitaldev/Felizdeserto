"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ContactMessage } from "@/types/database";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MensagensPage() {
  const supabase = createClient();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const load = useCallback(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    setMessages((data ?? []) as ContactMessage[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  async function markRead(id: string, is_read: boolean) {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read } : m)));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from("contact_messages").update({ is_read }).eq("id", id);
  }

  async function handleOpen(msg: ContactMessage) {
    const next = openId === msg.id ? null : msg.id;
    setOpenId(next);
    if (next && !msg.is_read) markRead(msg.id, true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir esta mensagem? Esta ação não pode ser desfeita.")) return;
    setMessages((prev) => prev.filter((m) => m.id !== id));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from("contact_messages").delete().eq("id", id);
  }

  const unreadCount = messages.filter((m) => !m.is_read).length;
  const visible = filter === "unread" ? messages.filter((m) => !m.is_read) : messages;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Mensagens
            {unreadCount > 0 && (
              <span className="text-xs font-semibold bg-brand-blue text-white px-2 py-0.5 rounded-full">
                {unreadCount} não lida{unreadCount > 1 ? "s" : ""}
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Mensagens recebidas pelo formulário Fale Conosco</p>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setFilter("all")}
            className={`text-sm px-3 py-1 rounded-md transition-colors ${
              filter === "all" ? "bg-white shadow-sm font-medium text-gray-800" : "text-gray-500"
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`text-sm px-3 py-1 rounded-md transition-colors ${
              filter === "unread" ? "bg-white shadow-sm font-medium text-gray-800" : "text-gray-500"
            }`}
          >
            Não lidas
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-400 py-20 text-center">Carregando...</div>
      ) : visible.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <svg className="w-12 h-12 text-gray-200 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-400">
            {filter === "unread" ? "Nenhuma mensagem não lida" : "Nenhuma mensagem recebida"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((msg) => {
            const open = openId === msg.id;
            return (
              <div
                key={msg.id}
                className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
                  msg.is_read ? "border-gray-200" : "border-brand-blue/40 bg-brand-blue/[0.02]"
                }`}
              >
                <button
                  onClick={() => handleOpen(msg)}
                  className="w-full text-left px-5 py-4 flex items-start gap-3"
                >
                  {!msg.is_read && <span className="w-2 h-2 rounded-full bg-brand-blue mt-2 flex-shrink-0" />}
                  <div className={`flex-1 min-w-0 ${msg.is_read ? "ml-5" : ""}`}>
                    <div className="flex items-center justify-between gap-3">
                      <h3 className={`truncate ${msg.is_read ? "font-medium text-gray-700" : "font-bold text-gray-900"}`}>
                        {msg.subject}
                      </h3>
                      <span className="text-xs text-gray-400 flex-shrink-0">{formatDate(msg.created_at)}</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate mt-0.5">
                      <span className="font-medium text-gray-600">{msg.name}</span> — {msg.email}
                    </p>
                    {!open && <p className="text-sm text-gray-400 truncate mt-1">{msg.message}</p>}
                  </div>
                </button>

                {open && (
                  <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm">
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Nome</p>
                        <p className="text-gray-700">{msg.name}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">E-mail</p>
                        <a href={`mailto:${msg.email}`} className="text-brand-blue hover:underline break-all">{msg.email}</a>
                      </div>
                      {msg.phone && (
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Telefone</p>
                          <a href={`tel:${msg.phone}`} className="text-gray-700 hover:text-brand-blue">{msg.phone}</a>
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Mensagem</p>
                    <p className="text-gray-700 whitespace-pre-wrap text-sm bg-gray-50 rounded-xl p-4">{msg.message}</p>

                    <div className="flex flex-wrap gap-3 items-center mt-4">
                      <a
                        href={`mailto:${msg.email}?subject=${encodeURIComponent("Re: " + msg.subject)}`}
                        className="btn-primary text-sm"
                      >
                        Responder por e-mail
                      </a>
                      <button onClick={() => markRead(msg.id, !msg.is_read)} className="btn-outline text-sm">
                        {msg.is_read ? "Marcar como não lida" : "Marcar como lida"}
                      </button>
                      <button
                        onClick={() => handleDelete(msg.id)}
                        className="ml-auto text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
