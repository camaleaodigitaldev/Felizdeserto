import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import type { Secretaria } from "@/types/database";

export default async function AdminSecretariasPage() {
  const supabase = await createClient();
  const { data: secretarias } = await supabase
    .from("secretarias")
    .select("*")
    .order("display_order");

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Secretarias</h1>
          <p className="text-gray-500 text-sm mt-1">{secretarias?.length ?? 0} secretarias</p>
        </div>
        <Link href="/admin/secretarias/nova" className="btn-primary text-sm">
          + Nova Secretaria
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(secretarias ?? []).map((sec: Secretaria) => (
          <div key={sec.id} className="bg-white rounded-xl border border-gray-200 p-5 flex gap-4">
            {sec.secretary_photo_url ? (
              <div className="relative w-14 h-14 flex-shrink-0 rounded-full overflow-hidden">
                <Image src={sec.secretary_photo_url} alt={sec.secretary_name} fill className="object-cover" sizes="56px" />
              </div>
            ) : (
              <div className="w-14 h-14 flex-shrink-0 rounded-full bg-gradient-to-br from-brand-blue to-brand-blue-light flex items-center justify-center">
                <span className="text-white font-bold text-xl">{sec.name.charAt(0)}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-brand-green uppercase tracking-wide mb-0.5">
                Secretário(a)
              </p>
              <p className="font-medium text-gray-900 text-sm leading-tight truncate">{sec.secretary_name}</p>
              <p className="text-xs text-gray-500 mt-1 leading-tight line-clamp-2">{sec.name}</p>
              <Link href={`/admin/secretarias/${sec.id}`} className="text-xs text-brand-blue hover:underline mt-2 inline-block font-medium">
                Editar →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
