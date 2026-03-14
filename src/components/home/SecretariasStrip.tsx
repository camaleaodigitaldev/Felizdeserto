import Link from "next/link";
import type { Secretaria } from "@/types/database";

interface Props {
  secretarias: Secretaria[];
}

export default function SecretariasStrip({ secretarias }: Props) {
  if (!secretarias.length) return null;

  return (
    <section className="py-12 bg-white">
      <div className="container-site">
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-3">
            <span className="w-1 h-7 rounded-full bg-brand-blue" />
            <h2 className="section-title">Secretarias Municipais</h2>
          </div>
          <Link href="/governo/secretarias" className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-brand-blue border-2 border-brand-blue/20 px-4 py-2 rounded-xl hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-all duration-200">
            Ver todas
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {secretarias.slice(0, 10).map((sec) => (
            <Link
              key={sec.id}
              href={`/governo/secretarias/${sec.slug}`}
              className="flex flex-col items-center text-center p-4 rounded-2xl border border-gray-100 hover:border-brand-blue/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group bg-white"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-blue-light flex items-center justify-center mb-3 group-hover:scale-110 group-hover:shadow-md transition-all duration-200 shadow-sm">
                <span className="text-white font-bold text-lg">
                  {(sec.short_name ?? sec.name).charAt(0)}
                </span>
              </div>
              <span className="text-xs font-semibold text-gray-800 leading-tight line-clamp-2 tracking-tight">
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
