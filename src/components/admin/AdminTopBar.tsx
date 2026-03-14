"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut, ChevronDown, User } from "lucide-react";

interface AdminTopBarProps {
  user: {
    name: string;
    email: string;
  };
}

export default function AdminTopBar({ user }: AdminTopBarProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      setIsLoading(false);
    }
  };

  const initials = user.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user.email.slice(0, 2).toUpperCase();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
      {/* Left: Page context (breadcrumb placeholder) */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 font-medium">
          Prefeitura de Feliz Deserto
        </span>
        <span className="text-gray-300">/</span>
        <span className="text-sm text-gray-800 font-semibold">Painel Administrativo</span>
      </div>

      {/* Right: User menu */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]/20"
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
        >
          {/* Avatar */}
          <div className="w-8 h-8 bg-[#1a3a6b] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-semibold">{initials}</span>
          </div>

          {/* User info */}
          <div className="hidden sm:flex flex-col items-start min-w-0">
            <span className="text-sm font-semibold text-gray-800 truncate max-w-[140px]">
              {user.name || user.email}
            </span>
            {user.name && (
              <span className="text-xs text-gray-500 truncate max-w-[140px]">
                {user.email}
              </span>
            )}
          </div>

          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
              dropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setDropdownOpen(false)}
            />

            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden">
              {/* User info header */}
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#1a3a6b] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-semibold">{initials}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {user.name || user.email}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="py-1">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    router.push("/admin/perfil");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="w-4 h-4 text-gray-400" />
                  Meu Perfil
                </button>

                <div className="my-1 border-t border-gray-100" />

                <button
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogOut className="w-4 h-4" />
                  {isLoading ? "Saindo..." : "Sair"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
