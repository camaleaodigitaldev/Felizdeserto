import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_PDF_TYPES = ["application/pdf"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_PDF_SIZE = 20 * 1024 * 1024;  // 20MB

export async function POST(req: NextRequest) {
  // Verify authentication
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { filename, contentType, bucket } = body as {
      filename: string;
      contentType: string;
      bucket: "news-images" | "editais-pdfs" | "banners" | "profiles" | "documentos";
    };

    // Validate file type
    const isImage = ALLOWED_IMAGE_TYPES.includes(contentType);
    const isPdf = ALLOWED_PDF_TYPES.includes(contentType);

    if (!isImage && !isPdf) {
      return NextResponse.json(
        { error: "Tipo de arquivo não permitido" },
        { status: 400 }
      );
    }

    if ((bucket === "editais-pdfs" || bucket === "documentos") && !isPdf) {
      return NextResponse.json(
        { error: "Apenas PDFs são permitidos neste bucket" },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    // Generate unique path
    const ext = filename.split(".").pop() ?? (isPdf ? "pdf" : "jpg");
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filePath = `${user.id}/${uniqueName}`;

    // Create signed upload URL
    const { data, error } = await admin.storage
      .from(bucket)
      .createSignedUploadUrl(filePath);

    if (error || !data) {
      console.error("[upload] signed URL error:", error);
      return NextResponse.json({ error: "Erro ao gerar URL de upload" }, { status: 500 });
    }

    // Build public URL
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${filePath}`;

    return NextResponse.json({
      signedUrl: data.signedUrl,
      publicUrl,
      path: filePath,
    });
  } catch (err) {
    console.error("[upload] error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
