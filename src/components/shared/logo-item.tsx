import Image from "next/image"

/**
 * Fixed-size box per breakpoint so every logo owns a stable, identical area.
 * The box never changes size after the image loads (no CLS / no logos
 * shifting into each other), and `object-contain` keeps any logo fully
 * visible regardless of its intrinsic aspect ratio.
 *
 * Mobile: 56×144px (+40% height, +50% width vs before) — tablet & desktop
 * breakpoints below are intentionally left unchanged.
 */
export function LogoItem({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-14 w-36 shrink-0 sm:h-20 sm:w-40 lg:h-28 lg:w-56">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 144px, (max-width: 1024px) 160px, 224px"
        className="object-contain"
      />
    </div>
  )
}
