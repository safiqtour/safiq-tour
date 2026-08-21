"use client"

import Image from "next/image"
import { Section } from "@/components/ui/section"
import { Container } from "@/components/ui/container"
import { HeroFloatingCard } from "@/components/home/HeroFloatingCard"

const KEUNGGULAN = [
  {
    title: "Legalitas Resmi",
    desc: "Safiq Tour memiliki izin resmi sebagai PPIU dari Kementerian Agama RI, sehingga setiap keberangkatan dilakukan secara legal, aman, dan terpercaya.",
  },
  {
    title: "Pembimbing Ibadah Profesional",
    desc: "Setiap perjalanan didampingi oleh Pembimbing Ibadah berpengalaman yang memahami tata cara Umroh sesuai sunnah, sehingga jamaah dapat menjalankan ibadah dengan lebih tenang dan khusyuk.",
  },
  {
    title: "Jadwal Keberangkatan Pasti",
    desc: "Kami berkomitmen memberikan kepastian jadwal keberangkatan, sehingga jamaah dapat mempersiapkan perjalanan tanpa rasa khawatir.",
  },
  {
    title: "Hotel Sesuai Pilihan Paket",
    desc: "Fasilitas hotel disediakan sesuai dengan paket yang dipilih, dengan lokasi strategis dan kenyamanan yang menunjang ibadah selama berada di Tanah Suci.",
  },
  {
    title: "Maskapai Penerbangan Terpercaya",
    desc: "Kami menggunakan maskapai penerbangan yang jelas dan terpercaya, memberikan kenyamanan serta keamanan selama perjalanan.",
  },
  {
    title: "Harga Kompetitif",
    desc: "Kami menghadirkan biaya Umroh yang kompetitif dengan fasilitas yang sepadan, sehingga jamaah memperoleh nilai terbaik tanpa mengurangi kualitas pelayanan.",
  },
  {
    title: "Pelayanan Ramah & Responsif",
    desc: "Tim Safiq Tour selalu siap membantu setiap kebutuhan jamaah dengan pelayanan yang cepat, ramah, dan responsif mulai dari konsultasi, pendaftaran, keberangkatan hingga kepulangan.",
  },
  {
    title: "Perlindungan Asuransi Perjalanan",
    desc: "Seluruh jamaah mendapatkan perlindungan asuransi perjalanan internasional, sebagai bentuk komitmen kami dalam memberikan rasa aman selama menjalankan ibadah.",
  },
]

export default function AboutPage() {
  return (
    <>
      <section className="relative h-[60vh] min-h-[400px] -mt-20 flex items-center overflow-hidden">
        <Image
          src="/images/Hero-Nabawi-Abaut-us-Safiq-Tour.webp"
          alt="Tentang Safiq Tour"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(6,23,53,0.55)] to-[rgba(6,23,53,0.15)] md:from-[rgba(6,23,53,0.5)] md:to-[rgba(6,23,53,0.1)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(6,23,53,0.4)] via-transparent to-transparent" />
        <div className="absolute inset-0" style={{ boxShadow: "inset 0 0 150px rgba(0,0,0,0.4)" }} />
        <div className="relative z-10 mx-auto w-full max-w-(--container-max) px-3 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl font-bold text-white drop-shadow-lg md:text-5xl">
                Tentang Safiq Tour
              </h1>
              <p className="text-lg text-white/80 md:text-xl">
                Mengantarkan Langkah Suci Menuju Baitullah
              </p>
              <div className="inline-flex w-fit items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 backdrop-blur-xl">
                <span className="text-xs text-white/50 md:text-sm">Nomor Izin PPIU :</span>
                <span className="text-sm font-semibold tracking-wider text-white/90 md:text-base">
                  91202132200280002
                </span>
              </div>
            </div>
            <div className="hidden justify-self-end md:flex">
              <HeroFloatingCard simple />
            </div>
          </div>
        </div>
      </section>

      <Section>
        <Container>
          <div className="space-y-6 leading-relaxed">
            <p className="text-base leading-relaxed text-foreground/80 md:text-lg">
              Sejak berdiri pada tahun 2019, PT. Safiq Oto Mandiri (Safiq Tour) berkomitmen menjadi sahabat perjalanan
              ibadah yang amanah, profesional, dan dekat dengan jamaah. Kami percaya bahwa ibadah Umroh bukan sekadar
              perjalanan ke Tanah Suci, tetapi merupakan panggilan mulia yang harus dipersiapkan dengan pelayanan
              terbaik dan penuh tanggung jawab.
            </p>

            <p className="text-base leading-relaxed text-foreground/80 md:text-lg">
              Sebagai Penyelenggara Perjalanan Ibadah Umroh (PPIU) resmi yang terdaftar di Kementerian Agama Republik
              Indonesia dengan Nomor Izin PPIU: 91202132200280002, kami memberikan rasa aman dan kepastian kepada setiap
              jamaah sejak proses pendaftaran hingga kembali ke Tanah Air.
            </p>

            <p className="text-base leading-relaxed text-foreground/80 md:text-lg">
              Dari kantor kami di Kabupaten Bandung Barat, Safiq Tour melayani jamaah dari Bandung, Bandung Barat, dan
              sekitarnya dengan pelayanan ibadah yang amanah dan profesional.
            </p>
          </div>
        </Container>
      </Section>

      <Section variant="muted">
        <Container>
          <div className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Mengapa Memilih Safiq Tour?
            </h2>
            <p className="max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Kami menghadirkan pengalaman ibadah yang nyaman melalui pelayanan yang mengutamakan kualitas, kepercayaan,
              dan kepuasan jamaah.
            </p>

            <div className="grid gap-6 sm:grid-cols-2">
              {KEUNGGULAN.map((item) => (
                <div key={item.title} className="rounded-lg border bg-card p-6 shadow-sm">
                  <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="space-y-8">
            <div>
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Visi Kami</h2>
              <p className="max-w-4xl text-base leading-relaxed text-foreground/80 md:text-lg">
                Menjadi travel Umroh yang amanah, profesional, dan terpercaya serta menjadi pilihan utama masyarakat
                Indonesia dalam mewujudkan perjalanan ibadah yang nyaman, berkualitas, dan penuh keberkahan.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Misi Kami</h2>
              <ul className="list-inside list-disc space-y-3 text-base leading-relaxed text-foreground/80 md:text-lg">
                <li>Memberikan pelayanan terbaik kepada setiap jamaah dengan mengedepankan nilai amanah dan profesionalisme.</li>
                <li>Menyelenggarakan perjalanan Umroh sesuai syariat dengan pendampingan pembimbing ibadah yang kompeten.</li>
                <li>Menyediakan fasilitas berkualitas sesuai paket yang dipilih jamaah.</li>
                <li>Mengutamakan transparansi, kenyamanan, dan kepastian keberangkatan.</li>
                <li>Membangun hubungan jangka panjang dengan jamaah melalui pelayanan yang ramah dan penuh kepedulian.</li>
              </ul>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
