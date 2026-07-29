export interface HotelInfo {
  city: string
  name: string
  stars: number
  distance: string
  desc: string
  images: string[]
}

export interface AirlineInfo {
  name: string
  logo: string
  baggage: string
  transit: string
  estimasi: string
  pesawat: string
}

export interface HighlightItem {
  title: string
  desc: string
}

export interface DayItinerary {
  day: number
  title: string
  desc: string
}

export interface PackageDetail {
  heroImage: string
  description: string
  highlights: HighlightItem[]
  itinerary: DayItinerary[]
  hotels: HotelInfo[]
  airlines: AirlineInfo[]
  included: string[]
  excluded: string[]
}

function makeItinerary(days: number): DayItinerary[] {
  const base = [
    { day: 1, title: "Jakarta → Jeddah", desc: "Penerbangan menuju Jeddah dengan layanan premium." },
    { day: 2, title: "Madinah", desc: "Perjalanan menuju Madinah untuk ibadah di Masjid Nabawi." },
    { day: 3, title: "Raudhah", desc: "Ziarah dan ibadah di Raudhah, taman surga." },
    { day: 4, title: "City Tour Madinah", desc: "Mengunjungi tempat bersejarah di Madinah." },
    { day: 5, title: "Menuju Mekkah", desc: "Perjalanan menuju Mekkah dengan miqat." },
    { day: 6, title: "Pelaksanaan Umroh", desc: "Thawaf, Sa'i, dan Tahallul." },
    { day: 7, title: "Ibadah Sunnah", desc: "Ibadah sunnah dan ziarah di Mekkah." },
    { day: 8, title: "Thawaf Wada", desc: "Thawaf perpisahan dan persiapan pulang." },
    { day: 9, title: "Indonesia", desc: "Penerbangan kembali ke Tanah Air." },
  ]

  if (days <= 9) return base.slice(0, days)

  const extended = [...base]
  for (let i = 10; i <= days; i++) {
    extended.push({
      day: i,
      title: i <= days - 1 ? "Ibadah Sunnah & Ziarah" : "Indonesia",
      desc: i <= days - 1
        ? "Memperbanyak ibadah sunnah dan ziarah di tempat bersejarah."
        : "Penerbangan kembali ke Tanah Air.",
    })
  }
  return extended
}

const commonExcluded = [
  "Biaya Vaksin Meningitis",
  "Pembuatan Paspor",
  "Biaya Pengiriman Perlengkapan",
  "Biaya Pribadi Selama Umroh",
  "Biaya Bagasi Ekstra",
]

const airlinesList: AirlineInfo[] = [
  { name: "Qatar Airways", logo: "/images/Qatar-Airways.png", baggage: "30 Kg", transit: "Non-stop / 1 Transit", estimasi: "±10 Jam", pesawat: "Airbus A380 / B777" },
  { name: "Emirates", logo: "/images/Emirates.png", baggage: "30 Kg", transit: "1 Transit", estimasi: "±11 Jam", pesawat: "Airbus A380 / B777" },
  { name: "Saudi Airlines", logo: "/images/Saudi-Airlines.png", baggage: "30 Kg", transit: "Non-stop", estimasi: "±9 Jam", pesawat: "Boeing B777 / B787" },
  { name: "Garuda Indonesia", logo: "/images/Garuda-Indonesia.png", baggage: "30 Kg", transit: "Non-stop / 1 Transit", estimasi: "±10 Jam", pesawat: "Airbus A330 / B777" },
  { name: "Turkish Airlines", logo: "/images/Turkish-Airlines.png", baggage: "30 Kg", transit: "1 Transit", estimasi: "±14 Jam", pesawat: "Airbus A350 / B777" },
]

const hotelMekahMap: Record<string, HotelInfo> = {
  zamzam: { city: "Mekkah", name: "Fajr Al Badea 4 / Setaraf", stars: 3, distance: "500 Meter", desc: "Hotel nyaman dengan lokasi strategis dekat Masjidil Haram.", images: [
    "/images/Hotel/Fajr-Al-Badea-4/Fajr-Al-Badea-4-Safiq-tour-01.webp",
    "/images/Hotel/Fajr-Al-Badea-4/Fajr-Al-Badea-4-Safiq-tour-02.webp",
    "/images/Hotel/Fajr-Al-Badea-4/Fajr-Al-Badea-4-Safiq-tour-03.webp",
    "/images/Hotel/Fajr-Al-Badea-4/Fajr-Al-Badea-4-Safiq-tour-04.webp",
    "/images/Hotel/Fajr-Al-Badea-4/Fajr-Al-Badea-4-Safiq-tour-05.webp",
    "/images/Hotel/Fajr-Al-Badea-4/Fajr-Al-Badea-4-Safiq-tour-06.webp",
    "/images/Hotel/Fajr-Al-Badea-4/Fajr-Al-Badea-4-Safiq-tour-07.webp",
    "/images/Hotel/Fajr-Al-Badea-4/Fajr-Al-Badea-4-Safiq-tour-08.webp",
    "/images/Hotel/Fajr-Al-Badea-4/Fajr-Al-Badea-4-Safiq-tour-09.webp",
  ] },
  thaibah: { city: "Mekkah", name: "Hotel Dar Al Eiman / Setaraf", stars: 4, distance: "100 Meter", desc: "Hotel modern dengan akses cepat ke Masjidil Haram.", images: [
    "/images/Hotel/Hotel-Dar-Al-Eiman/Hotel-Dar-Al-Eiman-01.webp",
    "/images/Hotel/Hotel-Dar-Al-Eiman/Hotel-Dar-Al-Eiman-02.webp",
    "/images/Hotel/Hotel-Dar-Al-Eiman/Hotel-Dar-Al-Eiman-03.webp",
    "/images/Hotel/Hotel-Dar-Al-Eiman/Hotel-Dar-Al-Eiman-04.webp",
  ] },
  rawdah: { city: "Mekkah", name: "Al Safwah Tower 3 / Setaraf", stars: 5, distance: "50 Meter", desc: "Hotel bintang lima dengan pemandangan langsung Masjidil Haram.", images: [
    "/images/Hotel/Al-Safwah-Tower-3/Al-Safwah-Tower-3-01.webp",
    "/images/Hotel/Al-Safwah-Tower-3/Al-Safwah-Tower-3-02.webp",
    "/images/Hotel/Al-Safwah-Tower-3/Al-Safwah-Tower-3-03.webp",
    "/images/Hotel/Al-Safwah-Tower-3/Al-Safwah-Tower-3-04.webp",
    "/images/Hotel/Al-Safwah-Tower-3/Al-Safwah-Tower-3-05.webp",
    "/images/Hotel/Al-Safwah-Tower-3/Al-Safwah-Tower-3-06.webp",
    "/images/Hotel/Al-Safwah-Tower-3/Al-Safwah-Tower-3-07.webp",
    "/images/Hotel/Al-Safwah-Tower-3/Al-Safwah-Tower-3-08.webp",
  ] },
  firdaus: { city: "Mekkah", name: "Hotel Pullman / Setaraf", stars: 5, distance: "100 Meter", desc: "Hotel mewah bintang lima dengan fasilitas premium.", images: ["/images/Ayuberga.png"] },
  ramadhan: { city: "Mekkah", name: "Hotel Dar Al Tawhid / Setaraf", stars: 4, distance: "100 Meter", desc: "Hotel nyaman dengan layanan istimewa selama Ramadhan.", images: ["/images/Rawahel-Al-Mashaer-co.png"] },
}

const hotelMadinahMap: Record<string, HotelInfo> = {
  zamzam: { city: "Madinah", name: "Al Baraka Karim / Setaraf", stars: 3, distance: "200 Meter", desc: "Hotel modern dengan akses mudah ke Masjid Nabawi.", images: [
    "/images/Hotel/Al-Baraka-Karim/Al-Baraka-Karim-safiq-tour-01.webp",
    "/images/Hotel/Al-Baraka-Karim/Al-Baraka-Karim-safiq-tour-02.webp",
    "/images/Hotel/Al-Baraka-Karim/Al-Baraka-Karim-safiq-tour-03.webp",
    "/images/Hotel/Al-Baraka-Karim/Al-Baraka-Karim-safiq-tour-04.webp",
  ] },
  thaibah: { city: "Madinah", name: "Hotel Al Mukhtarah / Setaraf", stars: 4, distance: "80 Meter", desc: "Hotel elegan dekat Masjid Nabawi dengan pelayanan prima.", images: [
    "/images/Hotel/Hotel-Al-Mukhtarah/Hotel-Al-Mukhtarah-01.webp",
    "/images/Hotel/Hotel-Al-Mukhtarah/Hotel-Al-Mukhtarah-02.webp",
    "/images/Hotel/Hotel-Al-Mukhtarah/Hotel-Al-Mukhtarah-03.webp",
    "/images/Hotel/Hotel-Al-Mukhtarah/Hotel-Al-Mukhtarah-04.webp",
    "/images/Hotel/Hotel-Al-Mukhtarah/Hotel-Al-Mukhtarah-05.webp",
    "/images/Hotel/Hotel-Al-Mukhtarah/Hotel-Al-Mukhtarah-06.webp",
    "/images/Hotel/Hotel-Al-Mukhtarah/Hotel-Al-Mukhtarah-07.webp",
    "/images/Hotel/Hotel-Al-Mukhtarah/Hotel-Al-Mukhtarah-08.webp",
  ] },
  rawdah: { city: "Madinah", name: "Maysan Al Harithia / Setaraf", stars: 5, distance: "50 Meter", desc: "Hotel bintang lima dengan fasilitas eksklusif di pusat Madinah.", images: [
    "/images/Hotel/Maysan-Al-Harithia/Maysan-Al-Harithia-01.webp",
    "/images/Hotel/Maysan-Al-Harithia/Maysan-Al-Harithia-02.webp",
    "/images/Hotel/Maysan-Al-Harithia/Maysan-Al-Harithia-03.webp",
    "/images/Hotel/Maysan-Al-Harithia/Maysan-Al-Harithia-04.webp",
    "/images/Hotel/Maysan-Al-Harithia/Maysan-Al-Harithia-06.webp",
    "/images/Hotel/Maysan-Al-Harithia/Maysan-Al-Harithia-07.webp",
  ] },
  firdaus: { city: "Madinah", name: "Hotel Oberoi / Setaraf", stars: 5, distance: "100 Meter", desc: "Hotel mewah dengan pemandangan indah Masjid Nabawi.", images: ["/images/Maysan.png"] },
  ramadhan: { city: "Madinah", name: "Hotel Al Ansar / Setaraf", stars: 4, distance: "80 Meter", desc: "Hotel strategis untuk ibadah dengan suasana Ramadhan.", images: ["/images/Maysan.png"] },
}

function getCategory(slug: string): string {
  if (slug.startsWith("zamzam")) return "zamzam"
  if (slug.startsWith("thaibah")) return "thaibah"
  if (slug.startsWith("rawdah")) return "rawdah"
  if (slug.startsWith("firdaus")) return "firdaus"
  if (slug.startsWith("ramadhan")) return "ramadhan"
  return "zamzam"
}

function getAirlines(slug: string): AirlineInfo[] {
  if (slug.startsWith("zamzam")) return [airlinesList[0], airlinesList[1]]
  if (slug.startsWith("thaibah")) return [airlinesList[2], airlinesList[3]]
  if (slug.startsWith("rawdah")) return [airlinesList[2]]
  if (slug.startsWith("firdaus")) return [airlinesList[1], airlinesList[4]]
  if (slug.startsWith("ramadhan")) return [airlinesList[2], airlinesList[3]]
  return [airlinesList[0]]
}

const detailMap: Record<string, Partial<PackageDetail>> = {
  "zamzam-express": {
    heroImage: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070&auto=format&fit=crop",
    description: "Paket Umroh ekonomis dengan pelayanan terbaik, hotel nyaman, dan pembimbing ibadah berpengalaman. Nikmati perjalanan ibadah yang nyaman dan penuh keberkahan.",
    highlights: [
      { title: "Tiket PP", desc: "Penerbangan pulang pergi" },
      { title: "Visa Umroh", desc: "Pengurusan visa lengkap" },
      { title: "Hotel Bintang 3", desc: "Dekat Masjidil Haram" },
      { title: "Hotel Madinah", desc: "Dekat Masjid Nabawi" },
      { title: "Makan 3x", desc: "Menu halal bergizi" },
      { title: "Air Zamzam", desc: "Oleh-oleh berkah" },
      { title: "Transportasi", desc: "Bus full AC" },
      { title: "City Tour", desc: "Wisata religi" },
      { title: "Perlengkapan", desc: "Koper, ihram, mukena" },
      { title: "Asuransi", desc: "Perjalanan internasional" },
      { title: "Handling", desc: "Layanan bandara" },
      { title: "Pembimbing", desc: "Ibadah sesuai sunnah" },
    ],
    included: ["Visa Umroh", "Hotel Bintang 3", "Tiket Pesawat PP", "Handling Bandara", "Makan 3x Sehari", "Air Zamzam 5 Liter", "Transportasi Bus AC", "Perlengkapan Ibadah", "Pembimbing Ibadah", "Asuransi Perjalanan"],
  },
  "zamzam-reguler": {
    heroImage: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070&auto=format&fit=crop",
    description: "Paket Umroh 12 hari dengan kenyamanan ekstra dan fasilitas lengkap. Cocok bagi Anda yang ingin ibadah lebih tenang dan tidak terburu-buru.",
    highlights: [
      { title: "Tiket PP", desc: "Penerbangan pulang pergi" },
      { title: "Visa Umroh", desc: "Pengurusan visa lengkap" },
      { title: "Hotel Bintang 3", desc: "Dekat Masjidil Haram" },
      { title: "Hotel Madinah", desc: "Dekat Masjid Nabawi" },
      { title: "Makan 3x", desc: "Menu halal bergizi" },
      { title: "Air Zamzam", desc: "Oleh-oleh berkah" },
      { title: "Transportasi", desc: "Bus full AC" },
      { title: "City Tour", desc: "Wisata religi" },
      { title: "Perlengkapan", desc: "Koper, ihram, mukena" },
      { title: "Asuransi", desc: "Perjalanan internasional" },
      { title: "Handling", desc: "Layanan bandara" },
      { title: "Pembimbing", desc: "Ibadah sesuai sunnah" },
    ],
    included: ["Visa Umroh", "Hotel Bintang 3", "Tiket Pesawat PP", "Handling Bandara", "Makan 3x Sehari", "Air Zamzam 5 Liter", "Transportasi Bus AC", "Perlengkapan Ibadah", "Pembimbing Ibadah", "Asuransi Perjalanan"],
  },
  "thaibah-deluxe": {
    heroImage: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070&auto=format&fit=crop",
    description: "Paket Umroh Deluxe dengan hotel bintang 4, lounge umroh eksklusif, dan pembimbing profesional. Pengalaman ibadah yang lebih nyaman dan berkesan.",
    highlights: [
      { title: "Tiket PP", desc: "Penerbangan pulang pergi" },
      { title: "Visa Umroh", desc: "Pengurusan visa lengkap" },
      { title: "Hotel Bintang 4", desc: "Dekat Masjidil Haram" },
      { title: "Hotel Madinah", desc: "Dekat Masjid Nabawi" },
      { title: "Makan 3x", desc: "Menu halal bergizi" },
      { title: "Air Zamzam", desc: "Oleh-oleh berkah" },
      { title: "Transportasi", desc: "Bus full AC" },
      { title: "Lounge Umroh", desc: "Ruangan eksklusif" },
      { title: "Perlengkapan", desc: "Koper, ihram, mukena" },
      { title: "Asuransi", desc: "Perjalanan internasional" },
      { title: "Handling", desc: "Layanan bandara" },
      { title: "Pembimbing", desc: "Ibadah sesuai sunnah" },
    ],
    included: ["Visa Umroh", "Hotel Bintang 4", "Tiket Pesawat PP", "Handling Bandara", "Makan 3x Sehari", "Air Zamzam 5 Liter", "Transportasi Bus AC", "Lounge Umroh", "Perlengkapan Ibadah", "Pembimbing Ibadah", "Asuransi Perjalanan"],
  },
  "thaibah-executive": {
    heroImage: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070&auto=format&fit=crop",
    description: "Paket Umroh Executive 12 hari dengan fasilitas premium, hotel bintang 4, dan pendampingan ibadah intensif untuk pengalaman Umroh yang maksimal.",
    highlights: [
      { title: "Tiket PP", desc: "Penerbangan pulang pergi" },
      { title: "Visa Umroh", desc: "Pengurusan visa lengkap" },
      { title: "Hotel Bintang 4", desc: "Dekat Masjidil Haram" },
      { title: "Hotel Madinah", desc: "Dekat Masjid Nabawi" },
      { title: "Makan 3x", desc: "Menu halal bergizi" },
      { title: "Air Zamzam", desc: "Oleh-oleh berkah" },
      { title: "Transportasi", desc: "Bus full AC" },
      { title: "Lounge Umroh", desc: "Ruangan eksklusif" },
      { title: "Perlengkapan", desc: "Koper, ihram, mukena" },
      { title: "Asuransi", desc: "Perjalanan internasional" },
      { title: "Handling", desc: "Layanan bandara" },
      { title: "Pembimbing", desc: "Ibadah sesuai sunnah" },
    ],
    included: ["Visa Umroh", "Hotel Bintang 4", "Tiket Pesawat PP", "Handling Bandara", "Makan 3x Sehari", "Air Zamzam 5 Liter", "Transportasi Bus AC", "Lounge Umroh", "Perlengkapan Ibadah", "Pembimbing Ibadah", "Asuransi Perjalanan"],
  },
  "rawdah-vip": {
    heroImage: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070&auto=format&fit=crop",
    description: "Paket Umroh VIP dengan hotel bintang 5, layanan eksklusif, dan pembimbing khusus. Pengalaman ibadah yang tak terlupakan dengan fasilitas terbaik.",
    highlights: [
      { title: "Tiket PP", desc: "Penerbangan pulang pergi" },
      { title: "Visa Umroh", desc: "Pengurusan visa lengkap" },
      { title: "Hotel Bintang 5", desc: "Dekat Masjidil Haram" },
      { title: "Hotel Madinah", desc: "Dekat Masjid Nabawi" },
      { title: "Makan 3x", desc: "Menu prasmanan" },
      { title: "Air Zamzam", desc: "Oleh-oleh berkah" },
      { title: "Transportasi", desc: "Bus premium AC" },
      { title: "Lounge Umroh", desc: "VIP eksklusif" },
      { title: "Perlengkapan", desc: "Koper, ihram, mukena" },
      { title: "Asuransi", desc: "Perjalanan internasional" },
      { title: "Handling", desc: "Layanan bandara" },
      { title: "Pembimbing", desc: "Ibadah sesuai sunnah" },
    ],
    included: ["Visa Umroh", "Hotel Bintang 5", "Tiket Pesawat PP", "Handling Bandara", "Makan 3x Sehari", "Air Zamzam 5 Liter", "Transportasi Bus AC", "Lounge Umroh VIP", "Perlengkapan Ibadah", "Pembimbing Ibadah", "Asuransi Perjalanan"],
  },
  "rawdah-luxury": {
    heroImage: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070&auto=format&fit=crop",
    description: "Paket Umroh Luxury 12 hari dengan pengalaman ibadah eksklusif, hotel bintang 5, dan pelayanan personal. Kemewahan dalam setiap langkah ibadah.",
    highlights: [
      { title: "Tiket PP", desc: "Penerbangan pulang pergi" },
      { title: "Visa Umroh", desc: "Pengurusan visa lengkap" },
      { title: "Hotel Bintang 5", desc: "Dekat Masjidil Haram" },
      { title: "Hotel Madinah", desc: "Dekat Masjid Nabawi" },
      { title: "Makan 3x", desc: "Menu prasmanan" },
      { title: "Air Zamzam", desc: "Oleh-oleh berkah" },
      { title: "Transportasi", desc: "Bus premium AC" },
      { title: "Lounge Umroh", desc: "VIP eksklusif" },
      { title: "Perlengkapan", desc: "Koper, ihram, mukena" },
      { title: "Asuransi", desc: "Perjalanan internasional" },
      { title: "Handling", desc: "Layanan bandara" },
      { title: "Pembimbing", desc: "Ibadah sesuai sunnah" },
    ],
    included: ["Visa Umroh", "Hotel Bintang 5", "Tiket Pesawat PP", "Handling Bandara", "Makan 3x Sehari", "Air Zamzam 5 Liter", "Transportasi Bus AC", "Lounge Umroh VIP", "Perlengkapan Ibadah", "Pembimbing Ibadah", "Asuransi Perjalanan"],
  },
  "firdaus-turki": {
    heroImage: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070&auto=format&fit=crop",
    description: "Paket Umroh Plus Turki 16 hari. Nikmati ibadah Umroh sekaligus wisata ke destinasi eksotis Istanbul dan Cappadocia. Pengalaman spiritual dan petualangan dalam satu paket.",
    highlights: [
      { title: "Tiket PP", desc: "Penerbangan pulang pergi" },
      { title: "Visa Umroh", desc: "Pengurusan visa lengkap" },
      { title: "Hotel Bintang 5", desc: "Dekat Masjidil Haram" },
      { title: "Turki Tour", desc: "Istanbul & Cappadocia" },
      { title: "Makan 3x", desc: "Menu halal bergizi" },
      { title: "Air Zamzam", desc: "Oleh-oleh berkah" },
      { title: "Transportasi", desc: "Bus full AC" },
      { title: "City Tour", desc: "Wisata religi & budaya" },
      { title: "Perlengkapan", desc: "Koper, ihram, mukena" },
      { title: "Asuransi", desc: "Perjalanan internasional" },
      { title: "Handling", desc: "Layanan bandara" },
      { title: "Pembimbing", desc: "Ibadah sesuai sunnah" },
    ],
    included: ["Visa Umroh", "Hotel Bintang 5", "Tiket Pesawat PP", "Handling Bandara", "Makan 3x Sehari", "Air Zamzam 5 Liter", "Transportasi Bus AC", "Tur Turki", "Lounge Umroh", "Perlengkapan Ibadah", "Pembimbing Ibadah", "Asuransi Perjalanan"],
  },
  "firdaus-mesir": {
    heroImage: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070&auto=format&fit=crop",
    description: "Paket Umroh Plus Mesir 15 hari. Padukan ibadah Umroh dengan wisata sejarah ke Piramida Giza, Sungai Nil, dan destinasi ikonik Mesir lainnya.",
    highlights: [
      { title: "Tiket PP", desc: "Penerbangan pulang pergi" },
      { title: "Visa Umroh", desc: "Pengurusan visa lengkap" },
      { title: "Hotel Bintang 5", desc: "Dekat Masjidil Haram" },
      { title: "Mesir Tour", desc: "Piramida & Sungai Nil" },
      { title: "Makan 3x", desc: "Menu halal bergizi" },
      { title: "Air Zamzam", desc: "Oleh-oleh berkah" },
      { title: "Transportasi", desc: "Bus full AC" },
      { title: "City Tour", desc: "Wisata religi & sejarah" },
      { title: "Perlengkapan", desc: "Koper, ihram, mukena" },
      { title: "Asuransi", desc: "Perjalanan internasional" },
      { title: "Handling", desc: "Layanan bandara" },
      { title: "Pembimbing", desc: "Ibadah sesuai sunnah" },
    ],
    included: ["Visa Umroh", "Hotel Bintang 5", "Tiket Pesawat PP", "Handling Bandara", "Makan 3x Sehari", "Air Zamzam 5 Liter", "Transportasi Bus AC", "Tur Mesir", "Lounge Umroh", "Perlengkapan Ibadah", "Pembimbing Ibadah", "Asuransi Perjalanan"],
  },
  "ramadhan-awal": {
    heroImage: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070&auto=format&fit=crop",
    description: "Paket Umroh Awal Ramadhan 12 hari. Raih keberkahan bulan suci dengan ibadah Umroh di awal Ramadhan. Fasilitas sahur dan berbuka puasa setiap hari.",
    highlights: [
      { title: "Tiket PP", desc: "Penerbangan pulang pergi" },
      { title: "Visa Umroh", desc: "Pengurusan visa lengkap" },
      { title: "Hotel Bintang 4", desc: "Dekat Masjidil Haram" },
      { title: "Hotel Madinah", desc: "Dekat Masjid Nabawi" },
      { title: "Sahur & Berbuka", desc: "Menu bergizi" },
      { title: "Air Zamzam", desc: "Oleh-oleh berkah" },
      { title: "Transportasi", desc: "Bus full AC" },
      { title: "Lounge Umroh", desc: "Ruangan eksklusif" },
      { title: "Perlengkapan", desc: "Koper, ihram, mukena" },
      { title: "Asuransi", desc: "Perjalanan internasional" },
      { title: "Handling", desc: "Layanan bandara" },
      { title: "Pembimbing", desc: "Ibadah sesuai sunnah" },
    ],
    included: ["Visa Umroh", "Hotel Bintang 4", "Tiket Pesawat PP", "Handling Bandara", "Sahur & Berbuka", "Air Zamzam 5 Liter", "Transportasi Bus AC", "Lounge Umroh", "Perlengkapan Ibadah", "Pembimbing Ibadah", "Asuransi Perjalanan"],
  },
  "ramadhan-full": {
    heroImage: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070&auto=format&fit=crop",
    description: "Paket Umroh Full Ramadhan 30 hari. Ibadah Umroh selama sebulan penuh di bulan suci. Fasilitas lengkap dengan sahur dan berbuka setiap hari.",
    highlights: [
      { title: "Tiket PP", desc: "Penerbangan pulang pergi" },
      { title: "Visa Umroh", desc: "Pengurusan visa lengkap" },
      { title: "Hotel Bintang 4", desc: "Dekat Masjidil Haram" },
      { title: "Hotel Madinah", desc: "Dekat Masjid Nabawi" },
      { title: "Sahur & Berbuka", desc: "Menu prasmanan" },
      { title: "Air Zamzam", desc: "Oleh-oleh berkah" },
      { title: "Transportasi", desc: "Bus full AC" },
      { title: "Lounge Umroh", desc: "Ruangan eksklusif" },
      { title: "Perlengkapan", desc: "Koper, ihram, mukena" },
      { title: "Asuransi", desc: "Perjalanan internasional" },
      { title: "Handling", desc: "Layanan bandara" },
      { title: "Pembimbing", desc: "Ibadah sesuai sunnah" },
    ],
    included: ["Visa Umroh", "Hotel Bintang 4", "Tiket Pesawat PP", "Handling Bandara", "Sahur & Berbuka", "Air Zamzam 5 Liter", "Transportasi Bus AC", "Lounge Umroh", "Perlengkapan Ibadah", "Pembimbing Ibadah", "Asuransi Perjalanan"],
  },
  "ramadhan-akhir": {
    heroImage: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070&auto=format&fit=crop",
    description: "Paket Umroh Akhir Ramadhan 15 hari. Raih malam Lailatul Qadar di Tanah Suci dengan ibadah Umroh di 10 hari terakhir Ramadhan yang penuh kemuliaan.",
    highlights: [
      { title: "Tiket PP", desc: "Penerbangan pulang pergi" },
      { title: "Visa Umroh", desc: "Pengurusan visa lengkap" },
      { title: "Hotel Bintang 4", desc: "Dekat Masjidil Haram" },
      { title: "Hotel Madinah", desc: "Dekat Masjid Nabawi" },
      { title: "Sahur & Berbuka", desc: "Menu bergizi" },
      { title: "Air Zamzam", desc: "Oleh-oleh berkah" },
      { title: "Transportasi", desc: "Bus full AC" },
      { title: "Lounge Umroh", desc: "Ruangan eksklusif" },
      { title: "Perlengkapan", desc: "Koper, ihram, mukena" },
      { title: "Asuransi", desc: "Perjalanan internasional" },
      { title: "Handling", desc: "Layanan bandara" },
      { title: "Pembimbing", desc: "Ibadah sesuai sunnah" },
    ],
    included: ["Visa Umroh", "Hotel Bintang 4", "Tiket Pesawat PP", "Handling Bandara", "Sahur & Berbuka", "Air Zamzam 5 Liter", "Transportasi Bus AC", "Lounge Umroh", "Perlengkapan Ibadah", "Pembimbing Ibadah", "Asuransi Perjalanan"],
  },
}

export function getPackageDetail(slug: string, duration: string): PackageDetail {
  const base = detailMap[slug] || detailMap["zamzam-express"]!
  const cat = getCategory(slug)
  const days = parseInt(duration) || 9

  const airlines = getAirlines(slug)

  const zamzam = detailMap["zamzam-express"] as PackageDetail

  return {
    heroImage: base.heroImage || zamzam.heroImage,
    description: base.description || zamzam.description,
    highlights: base.highlights! || zamzam.highlights,
    itinerary: makeItinerary(days),
    hotels: [hotelMekahMap[cat] || hotelMekahMap.zamzam, hotelMadinahMap[cat] || hotelMadinahMap.zamzam],
    airlines,
    included: base.included || zamzam.included,
    excluded: commonExcluded,
  }
}
