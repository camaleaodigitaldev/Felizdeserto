"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
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

  if (!banners.length) return null;

  return (
    <section className="relative overflow-hidden bg-brand-blue" aria-label="Destaques">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="relative flex-[0_0_100%] min-w-0 h-[56vw] sm:h-[520px] lg:h-[600px] bg-brand-blue"
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
              {/* Overlay lateral esquerdo */}
              <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/70 via-brand-blue/30 to-transparent" />
              {/* Overlay degradê preto inferior para legibilidade do texto */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

              {/* Content — canto inferior esquerdo */}
              <div className="absolute inset-0 flex items-end justify-start pb-6 sm:pb-8">
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
                        className="btn-secondary text-xs sm:text-base px-4 py-2 sm:px-6 sm:py-3"
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
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-sm transition-colors"
            aria-label="Anterior"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-sm transition-colors"
            aria-label="Próximo"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </section>
  );
}
