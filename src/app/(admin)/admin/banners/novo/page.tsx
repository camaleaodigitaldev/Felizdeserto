"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import ImageUploader from "@/components/admin/ImageUploader";

type FormData = {
  title: string;
  subtitle: string;
  image_url: string;
  link_url: string;
  link_label: string;
  display_order: number;
  is_active: boolean;
  show_gradient: boolean;
  link_on_image: boolean;
};

export default function NovoBannerPage() {
  const router = useRouter();
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const { register, control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      title: "",
      subtitle: "",
      image_url: "",
      link_url: "",
      link_label: "",
      display_order: 1,
      is_active: true,
      show_gradient: true,
      link_on_image: false,
    },
  });

  async function onSubmit(data: FormData) {
    setError("");
    setSaving(true);
    try {
      // Novo banner entra no fim da ordem (a ordenação é feita na lista).
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: last } = await (supabase as any)
        .from("banners")
        .select("display_order")
        .order("display_order", { ascending: false })
        .limit(1)
        .maybeSingle();
      const nextOrder = (last?.display_order ?? 0) + 1;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: err } = await (supabase as any).from("banners").insert({
        title: data.title,
        subtitle: data.subtitle || null,
        image_url: data.image_url || null,
        link_url: data.link_url || null,
        link_label: data.link_label || null,
        display_order: nextOrder,
        is_active: data.is_active,
        show_gradient: data.show_gradient,
        link_on_image: data.link_on_image,
      });
      if (err) throw new Error(err.message);
      router.push("/admin/banners");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Novo Banner</h1>
          <p className="text-sm text-gray-400 mt-0.5">Adicione um slide ao carrossel da página inicial</p>
        </div>
        <button onClick={() => router.back()} className="btn-outline text-sm">← Voltar</button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Image */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <span className="w-1 h-5 rounded-full bg-brand-blue" />
            Imagem de Fundo
          </h2>
          <Controller
            name="image_url"
            control={control}
            render={({ field }) => (
              <ImageUploader
                value={field.value || undefined}
                onChange={field.onChange}
                bucket="banners"
                label="Imagem do banner"
                accept="image/jpeg,image/png,image/webp"
              />
            )}
          />
          <p className="text-xs text-gray-400 mt-2">
            Recomendado: <strong>2240 × 700 px</strong> (proporção 16:5) · PNG, JPG ou WEBP · até 10MB
          </p>

          <label className="flex items-start gap-3 mt-4 pt-4 border-t border-gray-100 cursor-pointer">
            <input
              {...register("show_gradient")}
              type="checkbox"
              className="w-4 h-4 rounded accent-brand-blue mt-0.5"
            />
            <span className="text-sm">
              <span className="font-medium text-gray-700">Aplicar gradiente escuro sobre a imagem</span>
              <span className="block text-xs text-gray-400 mt-0.5">
                Melhora a leitura do título e do botão. Desmarque para imagens que já têm texto próprio (ex: cartazes de campanhas).
              </span>
            </span>
          </label>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-brand-green" />
            Conteúdo do Slide
          </h2>

          <div>
            <label className="label-base">Título *</label>
            <input
              {...register("title", { required: "Título obrigatório" })}
              className="input-base"
              placeholder="Ex: Acesse o Portal da Transparência"
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="label-base">Subtítulo</label>
            <input
              {...register("subtitle")}
              className="input-base"
              placeholder="Ex: Informações públicas ao alcance de todos"
            />
          </div>
        </div>

        {/* Button / Link */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-brand-gold" />
            Botão de Ação <span className="text-gray-400 font-normal text-sm">(opcional)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-base">Texto do botão</label>
              <input
                {...register("link_label")}
                className="input-base"
                placeholder="Ex: Acessar Portal"
              />
            </div>
            <div>
              <label className="label-base">Link de destino</label>
              <input
                {...register("link_url")}
                className="input-base"
                placeholder="Ex: https://... ou /pagina"
              />
            </div>
          </div>

          <label className="flex items-start gap-3 pt-4 border-t border-gray-100 cursor-pointer">
            <input
              {...register("link_on_image")}
              type="checkbox"
              className="w-4 h-4 rounded accent-brand-blue mt-0.5"
            />
            <span className="text-sm">
              <span className="font-medium text-gray-700">Tornar a imagem inteira clicável</span>
              <span className="block text-xs text-gray-400 mt-0.5">
                Ao clicar em qualquer parte do banner, abre o &quot;Link de destino&quot; acima. Requer o link preenchido.
              </span>
            </span>
          </label>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-gray-400" />
            Configurações
          </h2>

          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-3">
              <input
                {...register("is_active")}
                type="checkbox"
                id="is_active"
                className="w-4 h-4 rounded accent-brand-blue"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700 cursor-pointer">
                Banner ativo (visível no site)
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pb-8">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Salvando..." : "Salvar banner"}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-outline">Cancelar</button>
        </div>
      </form>
    </div>
  );
}
