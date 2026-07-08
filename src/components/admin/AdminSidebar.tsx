"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRole } from "@/types/database";
import {
  LayoutDashboard,
  Newspaper,
  FileText,
  FolderOpen,
  Image,
  Video,
  Phone,
  Building2,
  Mail,
  Settings,
  Users,
  ExternalLink,
  BarChart2,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: "Notícias",
    href: "/admin/noticias",
    icon: <Newspaper className="w-5 h-5" />,
  },
  {
    label: "Editais",
    href: "/admin/editais",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    label: "Documentos",
    href: "/admin/documentos",
    icon: <FolderOpen className="w-5 h-5" />,
  },
  {
    label: "Banners",
    href: "/admin/banners",
    icon: <Image className="w-5 h-5" />,
  },
  {
    label: "Vídeos",
    href: "/admin/videos",
    icon: <Video className="w-5 h-5" />,
  },
  {
    label: "Telefones",
    href: "/admin/telefones",
    icon: <Phone className="w-5 h-5" />,
  },
  {
    label: "Secretarias",
    href: "/admin/secretarias",
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    label: "Mensagens",
    href: "/admin/mensagens",
    icon: <Mail className="w-5 h-5" />,
  },
  {
    label: "Configurações",
    href: "/admin/configuracoes",
    icon: <Settings className="w-5 h-5" />,
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: <BarChart2 className="w-5 h-5" />,
    adminOnly: true,
  },
  {
    label: "Usuários",
    href: "/admin/usuarios",
    icon: <Users className="w-5 h-5" />,
    adminOnly: true,
  },
];

interface AdminSidebarProps {
  role: UserRole;
  onClose?: () => void;
}

export default function AdminSidebar({ role, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.adminOnly || role === "admin"
  );

  return (
    <aside className="w-64 h-full min-h-screen bg-[#1a3a6b] flex flex-col shadow-xl flex-shrink-0">
      {/* Logo / Brand */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex flex-col gap-2">
          <div className="bg-white rounded-lg px-3 py-2 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://desohrdjqujmmplawntj.supabase.co/storage/v1/object/public/banners/logo-2022feliznovo.png"
              alt="Prefeitura de Feliz Deserto"
              className="h-10 w-auto object-contain"
            />
          </div>
          <p className="text-white/50 text-xs truncate text-center">Painel Admin</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {visibleItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-150 group
                ${
                  active
                    ? "bg-white/15 text-white shadow-sm"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }
              `}
            >
              <span
                className={`flex-shrink-0 transition-colors ${
                  active ? "text-[#f59e0b]" : "text-white/50 group-hover:text-white/80"
                }`}
              >
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
              {active && (
                <span className="ml-auto w-1.5 h-1.5 bg-[#f59e0b] rounded-full flex-shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-all duration-150 group"
        >
          <ExternalLink className="w-5 h-5 flex-shrink-0 text-white/40 group-hover:text-white/70 transition-colors" />
          <span>Ver site</span>
          <span className="ml-auto text-white/30 text-xs">↗</span>
        </Link>
      </div>
    </aside>
  );
}
