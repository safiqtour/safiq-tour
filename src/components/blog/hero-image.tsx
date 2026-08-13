"use client";

import Image from "next/image";
import { useState } from "react";
import { ARTICLE_IMAGE_FALLBACK } from "@/lib/blog/utils";

/**
 * Hero image for the article detail hero card.
 *
 * Uses the article's own `featuredImage`. If that URL fails to load at
 * render time (e.g. an external image returns 404), it swaps to the Safiq
 * Tour fallback so the hero never shows a broken/empty area. The data flow
 * itself is untouched — this only guards the rendered <Image>.
 */
export function HeroImage({
  src,
  alt,
  sizes,
}: {
  src: string;
  alt: string;
  sizes: string;
}) {
  const [currentSrc, setCurrentSrc] = useState(src);

  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill
      className="object-cover object-center"
      priority
      sizes={sizes}
      onError={() => {
        if (currentSrc !== ARTICLE_IMAGE_FALLBACK) {
          setCurrentSrc(ARTICLE_IMAGE_FALLBACK);
        }
      }}
    />
  );
}
