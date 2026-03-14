import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="container-site py-3">
      <ol className="flex items-center gap-1 text-xs text-gray-500">
        <li>
          <Link href="/" className="hover:text-brand-blue transition-colors">
            Início
          </Link>
        </li>
        {crumbs.map((crumb, i) => (
          <li key={i} className="flex items-center gap-1">
            <span>/</span>
            {crumb.href && i < crumbs.length - 1 ? (
              <Link href={crumb.href} className="hover:text-brand-blue transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-gray-700 font-medium">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
