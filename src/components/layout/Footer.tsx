import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/constants";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-brand-blue-dark via-brand-blue to-brand-blue text-white mt-16">
      {/* Main footer */}
      <div className="container-site py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo + Info */}
          <div className="lg:col-span-2">
            <Image
              src="https://desohrdjqujmmplawntj.supabase.co/storage/v1/object/public/banners/logo-2022feliznovonomebranco.png"
              alt="Prefeitura de Feliz Deserto"
              width={180}
              height={60}
              className="h-14 w-auto object-contain mb-5"
            />
            <p className="text-blue-200/80 text-sm leading-relaxed max-w-sm">
              Portal oficial da Prefeitura Municipal de Feliz Deserto, Alagoas.{" "}
              <em className="text-brand-gold not-italic font-semibold">{SITE.slogan}</em>
            </p>
            <div className="mt-5 space-y-1.5 text-sm text-blue-200/70">
              <p>{SITE.address}</p>
              <p>{SITE.cityStateZip}</p>
              <p>{SITE.officeHours}</p>
              <p>CNPJ: {SITE.cnpj}</p>
            </div>
            <div className="mt-5 flex items-center gap-2">
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-200 hover:scale-105"
                aria-label="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links úteis */}
          <div>
            <h3 className="font-semibold text-white/90 mb-4 text-xs uppercase tracking-widest">
              Acesso Rápido
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: "/governo/prefeito", label: "Gabinete do Prefeito" },
                { href: "/governo/secretarias", label: "Secretarias" },
                { href: "/noticias", label: "Notícias" },
                { href: "/editais", label: "Editais e Licitações" },
                { href: "/videos", label: "Galeria de Vídeos" },
                { href: "/telefones-uteis", label: "Telefones Úteis" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-blue-200/70 hover:text-white transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-blue-400/50 group-hover:bg-brand-gold transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Transparência */}
          <div>
            <h3 className="font-semibold text-white/90 mb-4 text-xs uppercase tracking-widest">
              Transparência
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: SITE.transparencyUrl, label: "Portal da Transparência", external: true },
                { href: "/transparencia", label: "Acesso à Informação (LAI)" },
                { href: "/fale-conosco", label: "Fale Conosco" },
                { href: "/municipio/historia", label: "História do Município" },
                { href: "/politica-privacidade", label: "Política de Privacidade / LGPD" },
              ].map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-200/70 hover:text-white transition-colors flex items-center gap-1.5 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-blue-400/50 group-hover:bg-brand-gold transition-colors" />
                      {link.label} ↗
                    </a>
                  ) : (
                    <Link href={link.href} className="text-blue-200/70 hover:text-white transition-colors flex items-center gap-1.5 group">
                      <span className="w-1 h-1 rounded-full bg-blue-400/50 group-hover:bg-brand-gold transition-colors" />
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <a
                href={SITE.transparencyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Portal da Transparência
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-site py-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-blue-300/60">
          <p>
            © {year} Prefeitura Municipal de Feliz Deserto/AL. Todos os direitos reservados.
          </p>
          <p>
            Desenvolvido por{" "}
            <a
              href="https://wa.me/5582998439385"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-gold hover:text-white transition-colors font-medium"
            >
              Camaleão Digital
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
