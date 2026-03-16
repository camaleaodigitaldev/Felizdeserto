"use client";

import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { SITE } from "@/lib/constants";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Link from "next/link";

const schema = z.object({
  name: z.string().min(3, "Informe seu nome completo"),
  email: z.string().email("Informe um e-mail válido"),
  phone: z.string().optional(),
  subject: z.string().min(5, "Informe o assunto"),
  message: z.string().min(20, "Mensagem deve ter ao menos 20 caracteres"),
  consent: z.boolean().refine((v) => v === true, {
    message: "Você precisa concordar com a Política de Privacidade para enviar a mensagem",
  }),
});

type FormData = z.infer<typeof schema>;

export default function FaleConoscoPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json.error ?? "Erro ao enviar mensagem. Tente novamente.");
        return;
      }
      setSent(true);
      reset();
    } catch {
      setError("Erro de conexão. Verifique sua internet e tente novamente.");
    }
  }

  return (
    <>
      <Breadcrumbs crumbs={[{ label: "Fale Conosco" }]} />

      <div className="page-header">
        <div className="container-site">
          <h1 className="text-3xl font-bold">Fale Conosco</h1>
          <p className="text-blue-200 mt-1">Entre em contato com a Prefeitura de Feliz Deserto</p>
        </div>
      </div>

      <div className="container-site py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact info */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="font-bold text-brand-blue text-lg mb-5">Informações de Contato</h2>
              {[
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  ),
                  label: "Endereço",
                  value: `${SITE.address} — ${SITE.cityStateZip}`,
                },
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  ),
                  label: "Telefone",
                  value: SITE.phone,
                  href: `tel:${SITE.phone}`,
                },
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  ),
                  label: "E-mail",
                  value: SITE.email,
                  href: `mailto:${SITE.email}`,
                },
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ),
                  label: "Horário",
                  value: SITE.officeHours,
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="bg-brand-blue/10 p-2 rounded-lg flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {item.icon}
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-sm text-gray-700 hover:text-brand-blue transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm text-gray-700">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {sent ? (
              <div className="card p-10 text-center">
                <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Mensagem enviada!</h3>
                <p className="text-gray-500 mb-6">
                  Sua mensagem foi recebida com sucesso. Responderemos em breve.
                </p>
                <button onClick={() => setSent(false)} className="btn-outline">
                  Enviar nova mensagem
                </button>
              </div>
            ) : (
              <div className="card p-6">
                <h2 className="font-bold text-brand-blue text-lg mb-6">Envie sua mensagem</h2>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="label-base">Nome completo *</label>
                      <input {...register("name")} className="input-base" placeholder="Seu nome" />
                      {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="label-base">E-mail *</label>
                      <input {...register("email")} type="email" className="input-base" placeholder="seu@email.com" />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="label-base">Telefone</label>
                      <input {...register("phone")} className="input-base" placeholder="(82) 99999-9999" />
                    </div>
                    <div>
                      <label className="label-base">Assunto *</label>
                      <input {...register("subject")} className="input-base" placeholder="Assunto da mensagem" />
                      {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="label-base">Mensagem *</label>
                    <textarea
                      {...register("message")}
                      className="input-base resize-none"
                      rows={6}
                      placeholder="Escreva sua mensagem..."
                    />
                    {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
                  </div>

                  {/* Consentimento LGPD */}
                  <div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register("consent")}
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue flex-shrink-0"
                      />
                      <span className="text-sm text-gray-600">
                        Li e concordo com a{" "}
                        <Link
                          href="/politica-privacidade"
                          target="_blank"
                          className="text-brand-blue underline underline-offset-2 hover:text-blue-800"
                        >
                          Política de Privacidade
                        </Link>{" "}
                        e autorizo o uso dos meus dados para fins de atendimento pela Prefeitura de Feliz Deserto, conforme a Lei nº 13.709/2018 (LGPD). *
                      </span>
                    </label>
                    {errors.consent && (
                      <p className="text-xs text-red-500 mt-1 ml-7">{errors.consent.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full sm:w-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      "Enviar mensagem"
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
