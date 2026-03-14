// Tipos gerados manualmente com base no schema do Supabase
// Execute: npx supabase gen types typescript --project-id YOUR_ID > src/types/database.ts
// para gerar automaticamente após conectar ao Supabase

export type UserRole = "admin" | "editor";
export type NewsStatus = "draft" | "scheduled" | "published" | "archived";
export type EditalStatus = "aberto" | "encerrado" | "suspenso" | "anulado" | "homologado";
export type EditalCategory =
  | "licitacao"
  | "pregao"
  | "dispensa"
  | "inexigibilidade"
  | "chamamento_publico"
  | "concurso_publico"
  | "processo_seletivo"
  | "outro";

export interface Database {
  public: {
    PostgrestVersion: "12";
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          role: UserRole;
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          role?: UserRole;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string;
          role?: UserRole;
          avatar_url?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      news_categories: {
        Row: {
          id: number;
          name: string;
          slug: string;
          color: string;
          created_at: string;
        };
        Insert: {
          name: string;
          slug: string;
          color?: string;
          created_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          color?: string;
        };
      };
      news: {
        Row: {
          id: string;
          title: string;
          slug: string;
          summary: string | null;
          body: string;
          cover_image_url: string | null;
          category_id: number | null;
          author_id: string | null;
          status: NewsStatus;
          published_at: string | null;
          scheduled_for: string | null;
          views: number;
          tags: string[];
          meta_title: string | null;
          meta_description: string | null;
          og_image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          summary?: string | null;
          body?: string;
          cover_image_url?: string | null;
          category_id?: number | null;
          author_id?: string | null;
          status?: NewsStatus;
          published_at?: string | null;
          scheduled_for?: string | null;
          views?: number;
          tags?: string[];
          meta_title?: string | null;
          meta_description?: string | null;
          og_image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["news"]["Insert"]>;
      };
      secretarias: {
        Row: {
          id: number;
          name: string;
          slug: string;
          short_name: string | null;
          secretary_name: string;
          secretary_photo_url: string | null;
          description: string | null;
          phone: string | null;
          email: string | null;
          address: string | null;
          hours: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          // Mini-site fields (migration 002)
          cover_image_url: string | null;
          accent_color: string | null;
          logo_url: string | null;
          mission: string | null;
          news_category_id: number | null;
        };
        Insert: Omit<Database["public"]["Tables"]["secretarias"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["secretarias"]["Insert"]>;
      };
      editais: {
        Row: {
          id: string;
          title: string;
          number: string;
          category: EditalCategory;
          status: EditalStatus;
          description: string | null;
          pdf_url: string | null;
          pdf_filename: string | null;
          opening_date: string | null;
          closing_date: string | null;
          value: number | null;
          published_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["editais"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["editais"]["Insert"]>;
      };
      videos: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          youtube_url: string;
          youtube_id: string;
          thumbnail_url: string | null;
          is_featured: boolean;
          display_order: number;
          published_by: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["videos"]["Row"], "id" | "created_at" | "display_order" | "is_featured"> & {
          id?: string;
          created_at?: string;
          display_order?: number;
          is_featured?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["videos"]["Insert"]>;
      };
      useful_phones: {
        Row: {
          id: number;
          category: string;
          name: string;
          phone: string;
          notes: string | null;
          display_order: number;
          is_active: boolean;
        };
        Insert: Omit<Database["public"]["Tables"]["useful_phones"]["Row"], "id" | "is_active"> & { id?: number; is_active?: boolean };
        Update: Partial<Database["public"]["Tables"]["useful_phones"]["Insert"]>;
      };
      instagram_cache: {
        Row: {
          id: number;
          post_id: string;
          caption: string | null;
          media_url: string;
          permalink: string;
          media_type: string;
          timestamp: string;
          cached_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["instagram_cache"]["Row"], "id" | "cached_at"> & {
          id?: number;
          cached_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["instagram_cache"]["Insert"]>;
      };
      banners: {
        Row: {
          id: number;
          title: string;
          subtitle: string | null;
          image_url: string;
          link_url: string | null;
          link_label: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["banners"]["Row"], "id" | "created_at"> & {
          id?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["banners"]["Insert"]>;
      };
      site_settings: {
        Row: {
          key: string;
          value: string | null;
          label: string;
          setting_group: string;
          updated_at: string;
        };
        Insert: {
          key: string;
          value?: string | null;
          label: string;
          setting_group?: string;
          updated_at?: string;
        };
        Update: {
          value?: string | null;
          label?: string;
          setting_group?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

// Helpers de tipo
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type NewsCategory = Database["public"]["Tables"]["news_categories"]["Row"];
export type News = Database["public"]["Tables"]["news"]["Row"];
export type Secretaria = Database["public"]["Tables"]["secretarias"]["Row"];
export type Edital = Database["public"]["Tables"]["editais"]["Row"];
export type Video = Database["public"]["Tables"]["videos"]["Row"];
export type UsefulPhone = Database["public"]["Tables"]["useful_phones"]["Row"];
export type InstagramPost = Database["public"]["Tables"]["instagram_cache"]["Row"];
export type Banner = Database["public"]["Tables"]["banners"]["Row"];
export type SiteSetting = Database["public"]["Tables"]["site_settings"]["Row"];

// News com joins
export type NewsWithCategory = News & {
  news_categories: NewsCategory | null;
  profiles: Pick<Profile, "full_name"> | null;
};
