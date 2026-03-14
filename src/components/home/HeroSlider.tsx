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
              className="relative flex-[0_0_100%] min-w-0 h-[420px] sm:h-[520px] lg:h-[600px]"
            >
              <Image
                src={banner.image_url}
                alt={banner.title}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/80 via-brand-blue/50 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="container-site">
                  <div className="max-w-xl animate-slide-up">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3">
                      {banner.title}
                    </h2>
                    {banner.subtitle && (
                      <p className="text-blue-100 text-lg mb-6">{banner.subtitle}</p>
                    )}
                    {banner.link_url && banner.link_label && (
                      <Link
                        href={banner.link_url}
                        className="btn-secondary text-base px-6 py-3"
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
