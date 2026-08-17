import { Section, SectionHeader, SectionTitle, SectionDescription } from "@/components/ui/section"
import { Container } from "@/components/ui/container"

const fasilitas = [
  {
    icon: "🍽️",
    title: "Konsumsi",
    desc: "Kami menyediakan konsumsi selama perjalanan sesuai dengan jadwal yang telah ditentukan, sehingga jamaah dapat menjalankan ibadah dengan nyaman tanpa khawatir mengenai kebutuhan makan dan minum.",
  },
  {
    icon: "🛂",
    title: "Visa Umrah",
    desc: "Seluruh proses pengurusan visa Umrah ditangani oleh tim profesional Safiq Tour secara resmi, cepat, dan sesuai dengan ketentuan pemerintah Arab Saudi.",
  },
  {
    icon: "🎒",
    title: "Perlengkapan Umrah",
    desc: "Setiap jamaah akan mendapatkan perlengkapan Umrah eksklusif yang meliputi koper, tas kabin, tas paspor, seragam, kain ihram (untuk pria), mukena (sesuai paket), ID Card, dan perlengkapan pendukung lainnya.",
  },
  {
    icon: "✈️",
    title: "Tiket Pesawat Pulang Pergi",
    desc: "Tiket penerbangan internasional pulang-pergi telah termasuk dalam paket menggunakan maskapai terpercaya dengan jadwal keberangkatan yang telah dipastikan.",
  },
  {
    icon: "🕌",
    title: "Pembimbing Ibadah",
    desc: "Perjalanan ibadah didampingi oleh pembimbing yang berpengalaman dan memahami tata cara Umrah sesuai sunnah, sehingga jamaah dapat menjalankan setiap rangkaian ibadah dengan benar dan khusyuk.",
  },
  {
    icon: "🤝",
    title: "Tour Leader & Muthawif",
    desc: "Selama perjalanan jamaah akan didampingi oleh Tour Leader Indonesia dan Muthawif di Tanah Suci yang siap membantu kebutuhan jamaah, memberikan arahan, serta memastikan perjalanan berjalan dengan lancar.",
  },
  {
    icon: "🏨",
    title: "Hotel Penginapan",
    desc: "Kami menyediakan hotel yang nyaman sesuai pilihan paket dengan lokasi strategis di sekitar Masjidil Haram dan Masjid Nabawi agar jamaah lebih mudah dalam menjalankan ibadah.",
  },
  {
    icon: "🚌",
    title: "Transportasi",
    desc: "Transportasi yang nyaman dan berstandar internasional telah disiapkan untuk seluruh aktivitas perjalanan, mulai dari bandara, hotel, hingga city tour sesuai dengan program perjalanan.",
  },
  {
    icon: "📸",
    title: "Dokumentasi Perjalanan",
    desc: "Momen terbaik selama perjalanan ibadah akan diabadikan oleh tim dokumentasi Safiq Tour sehingga jamaah dapat menyimpan kenangan indah bersama keluarga dan rombongan.",
  },
]

function FacilitiesSection() {
  return (
    <Section>
      <Container>
        <SectionHeader>
          <SectionTitle className="text-[#0F2D5C] sm:text-3xl md:text-4xl">Fasilitas Jemaah</SectionTitle>
          <SectionDescription>
            Semua Kebutuhan Perjalanan Ibadah Anda Telah Kami Persiapkan
          </SectionDescription>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            Safiq Tour menghadirkan fasilitas lengkap untuk memastikan setiap jamaah dapat beribadah dengan tenang,
            nyaman, dan fokus tanpa harus memikirkan kebutuhan teknis selama perjalanan.
          </p>
        </SectionHeader>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {fasilitas.map((item) => (
            <div
              key={item.title}
              className="group rounded-2xl border border-border/50 bg-white/60 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/30 hover:shadow-md hover:shadow-[#D4AF37]/5"
            >
              <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-2xl transition-transform duration-300 group-hover:scale-110">
                {item.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-[#0F2D5C]">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}

export { FacilitiesSection }
