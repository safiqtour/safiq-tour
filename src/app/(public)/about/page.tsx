import { Section } from "@/components/ui/section"
import { Container } from "@/components/ui/container"

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
      <Section>
        <Container>
          <div className="space-y-6 leading-relaxed">
            <h1 className="text-4xl font-bold tracking-tight text-[#D4AF37] md:text-5xl">
              Tentang Safiq Tour
            </h1>
            <h2 className="text-xl font-semibold text-muted-foreground md:text-2xl">
              Mengantarkan Langkah Suci Menuju Baitullah
            </h2>

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
