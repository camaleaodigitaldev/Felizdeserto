import { createClient } from "@/lib/supabase/server";
import HeroSlider from "@/components/home/HeroSlider";
import FeaturedAndServices from "@/components/home/FeaturedAndServices";
import LatestNews from "@/components/home/LatestNews";
import TransparencyBar from "@/components/home/TransparencyBar";
import InstagramFeed from "@/components/home/InstagramFeed";
import SecretariasStrip from "@/components/home/SecretariasStrip";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { SITE } from "@/lib/constants";
import type { NewsWithCategory } from "@/types/database";

export const revalidate = 60;

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "GovernmentOrganization",
  name: SITE.name,
  alternateName: "Prefeitura de Feliz Deserto",
  url: SITE.url,
  logo: SITE.brasaoUrl,
  image: SITE.brasaoUrl,
  description: SITE.description,
  telephone: SITE.phone,
  email: SITE.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address,
    addressLocality: "Feliz Deserto",
    addressRegion: "AL",
    postalCode: "57220-000",
    addressCountry: "BR",
  },
  areaServed: {
    "@type": "City",
    name: "Feliz Deserto",
  },
  sameAs: [SITE.instagram],
};

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
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
