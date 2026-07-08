"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Banner } from "@/types/database";

interface Props {
  banners: Banner[];
}

export default function HeroSlider({ banners }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    const onReInit = () => {
      setScrollSnaps(emblaApi.scrollSnapList());
      onSelect();
    };
    onReInit();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onReInit);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onReInit);
    };
  }, [emblaApi]);

  if (!banners.length) return null;

  return (
    <section className="relative overflow-hidden bg-brand-blue" aria-label="Destaques">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="relative flex-[0_0_100%] min-w-0 aspect-[16/5] bg-brand-blue"
            >
              {banner.image_url && (
                <Image
                  src={banner.image_url}
                  alt={banner.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="100vw"
                />
              )}
              {banner.show_gradient && (
                <>
                  {/* Overlay lateral esquerdo */}
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/70 via-brand-blue/30 to-transparent" />
                  {/* Overlay degradê preto inferior para legibilidade do texto */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
                </>
              )}

              {/* Imagem inteira clicável (abre o link de destino) */}
              {banner.link_on_image && banner.link_url && (
                <Link
                  href={banner.link_url}
                  aria-label={banner.title}
                  className="absolute inset-0 z-10"
                  {...(banner.link_url.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                />
              )}

              {/* Content — canto inferior esquerdo.
                  pointer-events-none deixa o clique "passar" para o link da
                  imagem nas áreas vazias; os elementos interativos reativam
                  o clique com pointer-events-auto. */}
              <div className="absolute inset-0 z-20 flex items-end justify-start pb-6 sm:pb-8 pointer-events-none">
                <div className="container-site w-full">
                  <div className="max-w-xl animate-slide-up text-left">
                    <h2 className="text-xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-2 sm:mb-3">
                      {banner.title}
                    </h2>
                    {banner.subtitle && (
                      <p className="text-blue-100 text-sm sm:text-lg mb-3 sm:mb-6">{banner.subtitle}</p>
                    )}
                    {banner.link_url && banner.link_label && (
                      <Link
                        href={banner.link_url}
                        className="btn-secondary text-xs sm:text-base px-4 py-2 sm:px-6 sm:py-3 relative z-30 pointer-events-auto"
                        {...(banner.link_url.startsWith("http")
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {banner.link_label}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-40 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-sm transition-colors"
            aria-label="Anterior"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-40 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-sm transition-colors"
            aria-label="Próximo"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Pontos de paginação (indicadores de slide) */}
      {banners.length > 1 && (
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2">
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Ir para o slide ${i + 1}`}
              aria-current={i === selectedIndex}
              className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                i === selectedIndex
                  ? "w-5 sm:w-6 bg-white"
                  : "w-2 sm:w-2.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
