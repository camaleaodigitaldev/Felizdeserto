import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import AccessDenied from "@/components/admin/AccessDenied";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Gate de autorização: só contas com perfil ativo (staff/admin)
  // podem usar o painel. Sem isso, qualquer usuário autenticado
  // entraria na UI (o RLS ainda bloquearia dados, mas isto é
  // defesa em profundidade e evita telas quebradas).
  if (!profile || !profile.is_active) {
    return <AccessDenied />;
  }

  return (
    <AdminShell
      role={profile.role}
      user={{
        name: profile.full_name ?? user.email ?? "",
        email: user.email ?? "",
      }}
    >
      {children}
    </AdminShell>
  );
}
