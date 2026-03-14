import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar role={profile?.role ?? "editor"} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopBar
          user={{
            name: profile?.full_name ?? user.email ?? "",
            email: user.email ?? "",
          }}
        />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
