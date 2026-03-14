"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Profile, UserRole } from "@/types/database";
import {
  Users,
  Shield,
  Pencil,
  CheckCircle,
  XCircle,
  Search,
  Loader2,
  AlertCircle,
  ChevronDown,
  Save,
  X,
} from "lucide-react";

interface ProfileWithEmail extends Profile {
  email?: string;
}

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrador",
  editor: "Editor",
};

const ROLE_COLORS: Record<UserRole, string> = {
  admin: "bg-purple-100 text-purple-700",
  editor: "bg-blue-100 text-blue-700",
};

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateStr));
}

interface EditModalProps {
  profile: ProfileWithEmail;
  onClose: () => void;
  onSave: (id: string, updates: { role: UserRole; is_active: boolean }) => Promise<void>;
}

function EditModal({ profile, onClose, onSave }: EditModalProps) {
  const [role, setRole] = useState<UserRole>(profile.role);
  const [isActive, setIsActive] = useState(profile.is_active);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);
    setIsSaving(true);
    try {
      await onSave(profile.id, { role, is_active: isActive });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Editar Usuário</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-5">
          {/* User info */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-[#1a3a6b] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-semibold">
                {profile.full_name
                  .split(" ")
                  .slice(0, 2)
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">
                {profile.full_name}
              </p>
              {profile.email && (
                <p className="text-xs text-gray-500 truncate">{profile.email}</p>
              )}
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Role selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Função
            </label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full appearance-none border border-gray-200 rounded-lg px-4 py-2.5 pr-9 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]/20 focus:border-[#1a3a6b] transition-colors bg-white"
              >
                <option value="admin">Administrador</option>
                <option value="editor">Editor</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              {role === "admin"
                ? "Acesso total ao painel, incluindo gerenciamento de usuários."
                : "Pode criar e editar notícias e conteúdo, sem acesso a usuários."}
            </p>
          </div>

          {/* Active status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status da Conta
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsActive(true)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-green-50 border-green-300 text-green-700"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                Ativo
              </button>
              <button
                type="button"
                onClick={() => setIsActive(false)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                  !isActive
                    ? "bg-red-50 border-red-300 text-red-700"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                <XCircle className="w-4 h-4" />
                Inativo
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 bg-[#1a3a6b] hover:bg-[#2a5298] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Salvar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsuariosPage() {
  const [profiles, setProfiles] = useState<ProfileWithEmail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProfile, setEditingProfile] = useState<ProfileWithEmail | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchProfiles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setProfiles(data ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao carregar usuários. Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleSave = async (
    id: string,
    updates: { role: UserRole; is_active: boolean }
  ) => {
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        role: updates.role,
        is_active: updates.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) throw new Error(updateError.message);

    // Update local state
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, role: updates.role, is_active: updates.is_active } : p
      )
    );

    setSuccessMessage("Usuário atualizado com sucesso.");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const filteredProfiles = profiles.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.full_name.toLowerCase().includes(q) ||
      (p.email?.toLowerCase().includes(q) ?? false)
    );
  });

  const activeCount = profiles.filter((p) => p.is_active).length;
  const adminCount = profiles.filter((p) => p.role === "admin").length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gerencie os usuários com acesso ao painel administrativo.
          </p>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total de Usuários",
            value: profiles.length,
            icon: <Users className="w-5 h-5 text-white" />,
            bg: "bg-[#1a3a6b]",
          },
          {
            label: "Usuários Ativos",
            value: activeCount,
            icon: <CheckCircle className="w-5 h-5 text-white" />,
            bg: "bg-[#16a34a]",
          },
          {
            label: "Administradores",
            value: adminCount,
            icon: <Shield className="w-5 h-5 text-white" />,
            bg: "bg-purple-600",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4"
          >
            <div
              className={`w-11 h-11 ${stat.bg} rounded-xl flex items-center justify-center flex-shrink-0`}
            >
              {stat.icon}
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 tabular-nums">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{successMessage}</p>
        </div>
      )}

      {/* Search & Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Search bar */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="relative max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome ou e-mail..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]/20 focus:border-[#1a3a6b] transition-colors"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Carregando usuários...</span>
          </div>
        ) : error ? (
          <div className="px-6 py-12 text-center">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <p className="text-sm text-red-600 font-medium">{error}</p>
            <button
              onClick={fetchProfiles}
              className="mt-4 text-sm text-[#1a3a6b] hover:underline font-medium"
            >
              Tentar novamente
            </button>
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">
              {searchQuery ? "Nenhum usuário encontrado." : "Nenhum usuário cadastrado."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Função
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Criado em
                  </th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProfiles.map((profile) => {
                  const initials = profile.full_name
                    .split(" ")
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase();

                  return (
                    <tr
                      key={profile.id}
                      className="hover:bg-gray-50/60 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-[#1a3a6b] rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-semibold">
                              {initials}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate max-w-[200px]">
                              {profile.full_name}
                            </p>
                            {profile.email && (
                              <p className="text-xs text-gray-400 truncate max-w-[200px]">
                                {profile.email}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            ROLE_COLORS[profile.role]
                          }`}
                        >
                          {profile.role === "admin" && (
                            <Shield className="w-3 h-3" />
                          )}
                          {ROLE_LABELS[profile.role]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {profile.is_active ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                            Ativo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                            Inativo
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400 hidden lg:table-cell">
                        {formatDate(profile.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setEditingProfile(profile)}
                            className="inline-flex items-center gap-1.5 text-[#1a3a6b] hover:text-[#2a5298] text-xs font-medium transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            Editar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Table footer */}
        {!isLoading && !error && filteredProfiles.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-400">
              Exibindo {filteredProfiles.length} de {profiles.length} usuários
              {searchQuery && ` — filtrado por "${searchQuery}"`}
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingProfile && (
        <EditModal
          profile={editingProfile}
          onClose={() => setEditingProfile(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
