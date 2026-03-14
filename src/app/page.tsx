import { createClient } from "@/lib/supabase/server";
import HeroSlider from "@/components/home/HeroSlider";
import FeaturedAndServices from "@/components/home/FeaturedAndServices";
import LatestNews from "@/components/home/LatestNews";
import TransparencyBar from "@/components/home/TransparencyBar";
import InstagramFeed from "@/components/home/InstagramFeed";
import SecretariasStrip from "@/components/home/SecretariasStrip";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { NewsWithCategory } from "@/types/database";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();

  const [
    { data: banners },
    { data: newsData },
    { data: secretarias },
    { data: instagramPosts },
  ] = await Promise.all([
    supabase
      .from("banners")
      .select("*")
      .eq("is_active", true)
      .order("display_order"),
    supabase
      .from("news")
      .select("*, news_categories(*), profiles(full_name)")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(7),
    supabase
      .from("secretarias")
      .select("*")
      .eq("is_active", true)
      .order("display_order"),
    supabase
      .from("instagram_cache")
      .select("*")
      .order("cached_at", { ascending: false })
      .limit(9),
  ]);

  const news = (newsData ?? []) as unknown as NewsWithCategory[];
  const [featured, ...rest] = news;

  return (
    <>
      <Header />
      <main>
        <HeroSlider banners={banners ?? []} />
        <FeaturedAndServices featured={featured ?? null} />
        <LatestNews news={rest} />
        <TransparencyBar />
        <SecretariasStrip secretarias={secretarias ?? []} />
        {instagramPosts && instagramPosts.length > 0 && (
          <InstagramFeed posts={instagramPosts} />
        )}
      </main>
      <Footer />
    </>
  );
}
