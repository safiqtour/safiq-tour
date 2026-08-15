import Image from "next/image"
import { Section } from "@/components/ui/section"
import { Container } from "@/components/ui/container"
import { PackagesSection } from "@/components/shared/packages-section"
import { PembimbingSection } from "@/components/shared/pembimbing-section"
import { MuthawifTourLeaderSection } from "@/components/shared/muthawif-tour-leader-section"
import { FacilitiesSection } from "@/components/shared/facilities-section"
import { TestimonialsSection } from "@/components/shared/testimonials-section"
import { BlogSection } from "@/components/shared/blog-section"
import { LogoMarquee } from "@/components/shared/logo-marquee"
import { Hero } from "@/components/home/Hero"
import { getPublicPackages } from "@/modules/public/packages"

export const dynamic = "force-dynamic"

export default async function Home() {
  const allPackages = await getPublicPackages()

  return (
    <>
      <Hero />

      <PackagesSection packages={allPackages} showAllPackagesButton={false} />

      <Section>
        <Container>
          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
            <div className="space-y-6 leading-relaxed">
              <h2 className="text-2xl font-bold tracking-tight text-[#0F2D5C] sm:text-3xl md:text-4xl">
                Pelayanan Ramah dan Responsif
              </h2>
              <p className="text-base font-semibold text-[#D4AF37] md:text-lg">
                Komitmen Safiq Tour Melayani Jamaah dengan Sepenuh Hati
              </p>
              <p className="text-base text-muted-foreground md:text-lg">
                Dalam memilih travel umroh, pelayanan menjadi salah satu faktor yang sangat menentukan kenyamanan jamaah. Selain fasilitas dan jadwal keberangkatan, calon jamaah tentu menginginkan tim yang mudah dihubungi, ramah dalam memberikan informasi, serta sigap membantu setiap kebutuhan sejak proses pendaftaran hingga kembali ke Tanah Air.
              </p>
              <p className="text-base text-muted-foreground md:text-lg">
                Di Safiq Tour, kami percaya bahwa pelayanan terbaik adalah pelayanan yang dilakukan dengan tulus, profesional, dan penuh tanggung jawab. Oleh karena itu, kami berkomitmen untuk selalu memberikan pelayanan yang ramah dan responsif kepada setiap jamaah.
              </p>
            </div>
            <div className="relative">
              <div className="rounded-2xl border-2 border-[#D4AF37]/30 p-2 shadow-lg">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <Image
                    src="/images/Pelayanan-Ramah-Responsif-01.jpg"
                    alt="Pelayanan Ramah dan Responsif Safiq Tour"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 -z-10 h-full w-full rounded-2xl border-2 border-[#D4AF37]/10" />
            </div>
          </div>
        </Container>
      </Section>

      <PembimbingSection />

      <MuthawifTourLeaderSection />

      <Section variant="muted" className="overflow-x-hidden">
        <Container>
          <div className="space-y-8">
            <h2 className="text-2xl font-bold tracking-tight text-[#0F2D5C] sm:text-3xl md:text-4xl">
              Mitra Resmi
            </h2>
            <LogoMarquee />
          </div>
        </Container>
      </Section>

      <TestimonialsSection />

      <FacilitiesSection />

      <BlogSection />
    </>
  )
}
