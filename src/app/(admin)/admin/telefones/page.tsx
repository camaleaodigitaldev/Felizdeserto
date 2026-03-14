"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { UsefulPhone } from "@/types/database";

export default function AdminTelefonesPage() {
  const supabase = createClient();
  const [phones, setPhones] = useState<UsefulPhone[]>([]);
  const [saving, setSaving] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [newPhone, setNewPhone] = useState({ category: "", name: "", phone: "", notes: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    supabase
      .from("useful_phones")
      .select("*")
      .order("display_order")
      .then(({ data }) => setPhones(data ?? []));
  }, []);

  async function updatePhone(id: number, updates: Partial<UsefulPhone>) {
    setSaving(id);
    await supabase.from("useful_phones").update(updates).eq("id", id);
    setPhones((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    setSaving(null);
  }

  async function deletePhone(id: number) {
    if (!confirm("Remover este telefone?")) return;
    await supabase.from("useful_phones").delete().eq("id", id);
    setPhones((prev) => prev.filter((p) => p.id !== id));
  }

  async function addPhone() {
    if (!newPhone.category || !newPhone.name || !newPhone.phone) {
      setError("Categoria, nome e telefone são obrigatórios.");
      return;
    }
    setError("");
    const maxOrder = Math.max(0, ...phones.map((p) => p.display_order));
    const { data } = await supabase
      .from("useful_phones")
      .insert({ ...newPhone, display_order: maxOrder + 1 })
      .select()
      .single();
    if (data) {
      setPhones((prev) => [...prev, data]);
      setNewPhone({ category: "", name: "", phone: "", notes: "" });
      setAdding(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Telefones Úteis</h1>
          <p className="text-gray-500 text-sm mt-1">{phones.length} registros</p>
        </div>
        <button onClick={() => setAdding(true)} className="btn-primary">+ Adicionar</button>
      </div>

      {adding && (
        <div className="bg-white rounded-xl border border-brand-blue p-5 mb-6">
          <h3 className="font-semibold text-brand-blue mb-4">Novo telefone</h3>
          {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            <input value={newPhone.category} onChange={(e) => setNewPhone((p) => ({ ...p, category: e.target.value }))} className="input-base" placeholder="Categoria *" />
            <input value={newPhone.name} onChange={(e) => setNewPhone((p) => ({ ...p, name: e.target.value }))} className="input-base" placeholder="Nome *" />
            <input value={newPhone.phone} onChange={(e) => setNewPhone((p) => ({ ...p, phone: e.target.value }))} className="input-base" placeholder="Telefone *" />
            <input value={newPhone.notes} onChange={(e) => setNewPhone((p) => ({ ...p, notes: e.target.value }))} className="input-base" placeholder="Observação" />
          </div>
          <div className="flex gap-2">
            <button onClick={addPhone} className="btn-primary text-sm">Salvar</button>
            <button onClick={() => { setAdding(false); setError(""); }} className="btn-outline text-sm">Cancelar</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Categoria</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Nome</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Telefone</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium hidden md:table-cell">Ativo</th>
              <th className="text-right px-4 py-3 text-gray-500 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {phones.map((phone) => (
              <tr key={phone.id} className={`hover:bg-gray-50 ${!phone.is_active ? "opacity-50" : ""}`}>
                <td className="px-4 py-3 text-gray-600">{phone.category}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{phone.name}</td>
                <td className="px-4 py-3">
                  <a href={`tel:${phone.phone}`} className="text-brand-blue hover:underline font-medium">
                    {phone.phone}
                  </a>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <button
                    onClick={() => updatePhone(phone.id, { is_active: !phone.is_active })}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      phone.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {phone.is_active ? "Ativo" : "Inativo"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => deletePhone(phone.id)}
                    className="text-red-400 hover:text-red-600 text-sm ml-2"
                  >
                    {saving === phone.id ? "..." : "Remover"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
