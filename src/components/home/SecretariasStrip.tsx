import Link from "next/link";
import type { Secretaria } from "@/types/database";

interface Props {
  secretarias: Secretaria[];
}

export default function SecretariasStrip({ secretarias }: Props) {
  if (!secretarias.length) return null;

  return (
    <section className="py-10 bg-white">
      <div className="container-site">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">Secretarias Municipais</h2>
          <Link href="/governo/secretarias" className="text-brand-blue text-sm font-medium hover:underline">
            Ver todas →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {secretarias.slice(0, 10).map((sec) => (
            <Link
              key={sec.id}
              href={`/governo/secretarias/${sec.slug}`}
              className="flex flex-col items-center text-center p-4 rounded-xl border border-gray-100 hover:border-brand-blue hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-blue to-brand-blue-light flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-lg">
                  {(sec.short_name ?? sec.name).charAt(0)}
                </span>
              </div>
              <span className="text-xs font-semibold text-gray-800 leading-tight line-clamp-2">
                {sec.short_name ?? sec.name}
              </span>
              <span className="text-xs text-gray-400 mt-1 line-clamp-1 hidden sm:block">
                {sec.secretary_name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
