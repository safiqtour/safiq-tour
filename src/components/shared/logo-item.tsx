import Image from "next/image"

export function LogoItem({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={160}
      height={64}
      className="h-14 w-auto object-contain sm:h-28"
    />
  )
}
