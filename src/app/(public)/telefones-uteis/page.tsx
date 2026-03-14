import { createClient } from "@/lib/supabase/server";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import type { UsefulPhone } from "@/types/database";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Telefones Úteis",
  description: "Telefones úteis da Prefeitura e serviços do município de Feliz Deserto/AL.",
};

export default async function TelefonesPage() {
  const supabase = await createClient();
  const { data: phones } = await supabase
    .from("useful_phones")
    .select("*")
    .eq("is_active", true)
    .order("display_order");

  const grouped = (phones ?? []).reduce<Record<string, UsefulPhone[]>>((acc, phone) => {
    if (!acc[phone.category]) acc[phone.category] = [];
    acc[phone.category].push(phone);
    return acc;
  }, {});

  return (
    <>
      <Breadcrumbs crumbs={[{ label: "Telefones Úteis" }]} />

      <div className="page-header">
        <div className="container-site">
          <h1 className="text-3xl font-bold">Telefones Úteis</h1>
          <p className="text-blue-200 mt-1">Contatos essenciais de Feliz Deserto/AL</p>
        </div>
      </div>

      <div className="container-site py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="card p-5">
              <h2 className="font-bold text-brand-blue text-lg mb-4 pb-3 border-b border-gray-100">
                {category}
              </h2>
              <div className="space-y-3">
                {items.map((phone) => (
                  <div key={phone.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800">{phone.name}</p>
                      {phone.notes && (
                        <p className="text-xs text-gray-400">{phone.notes}</p>
                      )}
                    </div>
                    <a
                      href={`tel:${phone.phone.replace(/\D/g, "")}`}
                      className="flex-shrink-0 flex items-center gap-1.5 text-brand-blue font-semibold text-sm hover:text-brand-green transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {phone.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
