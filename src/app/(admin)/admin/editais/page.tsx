import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  EDITAL_CATEGORIES,
  EDITAL_STATUS_COLORS,
  EDITAL_STATUS_LABELS,
} from "@/lib/constants";
import type { Edital } from "@/types/database";

export default async function AdminEditaisPage() {
  const supabase = await createClient();
  const { data: editais } = await supabase
    .from("editais")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editais e Licitações</h1>
          <p className="text-gray-500 text-sm mt-1">{editais?.length ?? 0} editais cadastrados</p>
        </div>
        <Link href="/admin/editais/novo" className="btn-primary">
          + Novo Edital
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {!editais || editais.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400">Nenhum edital cadastrado.</p>
            <Link href="/admin/editais/novo" className="btn-primary mt-4 inline-flex">
              Cadastrar primeiro edital
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Edital</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium hidden md:table-cell">Tipo</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium hidden lg:table-cell">Encerra</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(editais as Edital[]).map((edital) => (
                  <tr key={edital.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{edital.title}</p>
                      <p className="text-xs text-gray-400">Nº {edital.number}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-600">
                      {EDITAL_CATEGORIES[edital.category] ?? edital.category}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${EDITAL_STATUS_COLORS[edital.status]}`}>
                        {EDITAL_STATUS_LABELS[edital.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-500">
                      {edital.closing_date
                        ? format(new Date(edital.closing_date + "T00:00:00"), "dd/MM/yyyy", { locale: ptBR })
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/editais/${edital.id}`}
                        className="text-brand-blue hover:underline text-sm font-medium"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
