import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl font-bold text-brand-blue/10 mb-4">404</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Página não encontrada</h1>
      <p className="text-gray-500 mb-8 max-w-sm">
        A página que você está procurando não existe ou foi movida.
      </p>
      <Link href="/" className="btn-primary">
        Voltar ao início
      </Link>
    </div>
  );
}
