import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { SITE } from "@/lib/constants";

export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(5),
  message: z.string().min(20),
});

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
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

    // Send to prefeitura
    await resend.emails.send({
      from: process.env.EMAIL_FROM ?? `noreply@felizdeserto.al.gov.br`,
      to: process.env.EMAIL_TO ?? SITE.email,
      subject: `[Fale Conosco] ${subject}`,
      html: `
        <h2 style="color:#1a3a6b">Nova mensagem via Fale Conosco</h2>
        <table cellpadding="8" style="border-collapse:collapse;width:100%">
          <tr><td style="background:#f8fafc;font-weight:bold;width:120px">Nome</td><td>${name}</td></tr>
          <tr><td style="background:#f8fafc;font-weight:bold">E-mail</td><td><a href="mailto:${email}">${email}</a></td></tr>
          ${phone ? `<tr><td style="background:#f8fafc;font-weight:bold">Telefone</td><td>${phone}</td></tr>` : ""}
          <tr><td style="background:#f8fafc;font-weight:bold">Assunto</td><td>${subject}</td></tr>
          <tr><td style="background:#f8fafc;font-weight:bold;vertical-align:top">Mensagem</td><td style="white-space:pre-wrap">${message}</td></tr>
        </table>
        <p style="color:#64748b;font-size:12px;margin-top:24px">
          Enviado via Portal ${SITE.name} em ${new Date().toLocaleString("pt-BR")}
        </p>
      `,
    });

    // Auto-reply to sender
    await resend.emails.send({
      from: process.env.EMAIL_FROM ?? `noreply@felizdeserto.al.gov.br`,
      to: email,
      subject: `Recebemos sua mensagem — ${SITE.name}`,
      html: `
        <h2 style="color:#1a3a6b">Olá, ${name}!</h2>
        <p>Recebemos sua mensagem sobre <strong>${subject}</strong> e entraremos em contato em breve.</p>
        <p style="color:#64748b">Atendimento: <strong>${SITE.officeHours}</strong></p>
        <p style="color:#64748b">Telefone: <strong>${SITE.phone}</strong></p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0"/>
        <p style="color:#94a3b8;font-size:12px">
          ${SITE.name} — ${SITE.address}<br/>
          CNPJ: ${SITE.cnpj}
        </p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact] error:", err);
    return NextResponse.json(
      { error: "Erro interno. Tente novamente mais tarde." },
      { status: 500 }
    );
  }
}
