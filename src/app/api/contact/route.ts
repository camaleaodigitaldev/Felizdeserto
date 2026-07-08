import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().min(3).max(120),
  email: z.string().email().max(160),
  phone: z.string().max(40).optional(),
  subject: z.string().min(5).max(160),
  message: z.string().min(20).max(5000),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.safeParse(body);

    if (!data.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: data.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = data.data;

    // Grava a mensagem no banco. Usa a service role porque o formulário
    // é público (sem usuário autenticado) e a tabela não permite insert
    // por anon via RLS.
    const supabase = createAdminClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("contact_messages").insert({
      name,
      email,
      phone: phone || null,
      subject,
      message,
    });

    if (error) {
      console.error("[contact] insert error:", error.message);
      return NextResponse.json(
        { error: "Erro ao registrar mensagem. Tente novamente mais tarde." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact] error:", err);
    return NextResponse.json(
      { error: "Erro interno. Tente novamente mais tarde." },
      { status: 500 }
    );
  }
}
