/**
 * Seed SOURCE data for the public Umrah packages.
 *
 * This data was previously hardcoded in `src/data/packages.ts`. The public site
 * now reads packages from the database (`publicContent` column, seeded below),
 * so this file lives only beside the seed as the bootstrap input — it is never
 * imported by application code.
 */
export interface Package {
  id: string
  slug: string
  title: string
  category: "zamzam" | "thaibah" | "rawdah" | "firdaus" | "ramadhan"
  duration: string
  price: number
  priceLabel?: string
  badge: string
  badgeVariant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"
  featured?: boolean
  image?: string
  features: string[]
  hotelMekah: string
  hotelMadinah: string
  maskapai: string
}

export const packages: Package[] = [
  {
    id: "1",
    slug: "zamzam-express",
    title: "Zamzam Express 9 Hari",
    category: "zamzam",
    duration: "9 Hari",
    price: 27999999,
    priceLabel: "Mulai dari",
    badge: "Best Seller",
    badgeVariant: "secondary",
    featured: true,
    image: "/images/Paket-Umroh-Zam-zam-Ekspress-9h.webp",
    hotelMekah: "Fajr Al Badea 4 /setaraf",
    hotelMadinah: "Al Baraka Karim /Setaraf",
    maskapai: "Qatar, Emirates",
    features: ["Hotel Bintang 3/setaraf", "Tiket Pesawat PP", "Makan 3x", "Visa Umroh", "Perlengkapan", "Pembimbing Ibadah", "Muthowif", "Manasik", "Handling Bandara"],
  },
  {
    id: "2",
    slug: "zamzam-reguler",
    title: "Zamzam Reguler 12 Hari",
    category: "zamzam",
    duration: "12 Hari",
    price: 31999999,
    priceLabel: "Mulai dari",
    badge: "Popular",
    badgeVariant: "default",
    image: "/images/Paket-Umroh-Zam-zam-Reguler-12h.webp",
    hotelMekah: "Fajr Al Badea 4 /setaraf",
    hotelMadinah: "Al Baraka Karim /Setaraf",
    maskapai: "Qatar, Emirates",
    features: ["Hotel Bintang 3 setaraf", "Tiket Pesawat PP", "Makan 3x", "Visa Umroh", "Perlengkapan", "Pembimbing Ibadah", "Muthowif", "Manasik", "Handling Bandara"],
  },
  {
    id: "3",
    slug: "thaibah-deluxe",
    title: "Thaibah Deluxe 9 Hari",
    category: "thaibah",
    duration: "9 Hari",
    price: 35999999,
    priceLabel: "Mulai dari",
    badge: "Recommended",
    badgeVariant: "outline",
    image: "/images/Paket-Umroh-thaibah-deluxe-Ekspress-9h.jpg",
    hotelMekah: "Hotel Dar Al Eiman / setaraf",
    hotelMadinah: "Hotel Al Mukhtarah / setaraf",
    maskapai: "Saudi Airlines / Garuda Indonesia",
    features: ["Hotel Bintang 3/4 setaraf", "Tiket Pesawat PP", "Bus PP", "Visa Umroh", "Perlengkapan", "Pembimbing Ibadah", "Muthowif", "Manasik", "Lounge Umroh", "Handling Bandara"],
  },
  {
    id: "4",
    slug: "thaibah-executive",
    title: "Thaibah Executive 12 Hari",
    category: "thaibah",
    duration: "12 Hari",
    price: 39999999,
    priceLabel: "Mulai dari",
    badge: "Popular",
    badgeVariant: "default",
    image: "/images/Paket-Umroh-thaibah-Executive-Ekspress-12h.jpg",
    hotelMekah: "Hotel Dar Al Eiman / setaraf",
    hotelMadinah: "Hotel Al Mukhtarah / setaraf",
    maskapai: "Saudi Airlines / Garuda Indonesia",
    features: ["Hotel Bintang 3/4 setaraf", "Tiket Pesawat PP", "Bus PP", "Visa Umroh", "Perlengkapan", "Pembimbing Ibadah", "Muthowif", "Manasik", "Lounge Umroh", "Handling Bandara"],
  },
  {
    id: "5",
    slug: "rawdah-deluxe",
    title: "Rawdah Deluxe 9 Hari",
    category: "rawdah",
    duration: "9 Hari",
    price: 49999999,
    priceLabel: "Mulai dari",
    badge: "Exclusive",
    badgeVariant: "destructive",
    image: "/images/Paket-Umroh-Rawdah-deluxe.webp",
    hotelMekah: "Al Safwah Tower 3 / Setaraf",
    hotelMadinah: "Maysan Al Harithia / Setaraf",
    maskapai: "Saudi Airlines",
    features: ["Hotel Bintang 5", "Tiket Pesawat PP", "Bus PP", "Visa Umroh", "Perlengkapan", "Pembimbing Ibadah", "Muthowif", "Manasik", "Lounge Umroh", "Handling Bandara", "City Tour"],
  },
  {
    id: "6",
    slug: "firdaus-executive",
    title: "Firdaus Executive 12 Hari",
    category: "firdaus",
    duration: "12 Hari",
    price: 59999999,
    priceLabel: "Mulai dari",
    badge: "Exclusive",
    badgeVariant: "destructive",
    image: "/images/Paket-Umroh-Firdaus.webp",
    hotelMekah: "Hotel Pullman / Setaraf",
    hotelMadinah: "Hotel Oberoi / Setaraf",
    maskapai: "Emirates / Turkish Airlines",
    features: ["Hotel Bintang 3/4/5", "Tiket Pesawat PP", "Bus PP", "Visa Umroh", "Perlengkapan", "Pembimbing Ibadah", "Muthowif", "Manasik", "Lounge Umroh", "Handling Bandara", "City Tour"],
  },
  {
    id: "9",
    slug: "ramadhan-awal",
    title: "Ramadhan Awal Ramadhan 12 Hari",
    category: "ramadhan",
    duration: "12 Hari",
    price: 40000000,
    priceLabel: "Mulai dari",
    badge: "Special",
    badgeVariant: "destructive",
    image: "/images/Paket-Ramadhan-Awal-Ramadhan-12-h.jpg",
    hotelMekah: "Hotel Dar Al Tawhid / setaraf",
    hotelMadinah: "Hotel Al Ansar / setaraf",
    maskapai: "Saudi Airlines / Garuda Indonesia",
    features: ["Hotel Bintang 3/4", "Tiket Pesawat PP", "Bus PP", "Visa Umroh", "Perlengkapan", "Sahur & Berbuka", "Pembimbing Ibadah", "Muthowif", "Manasik", "Lounge Umroh", "Handling Bandara"],
  },
  {
    id: "10",
    slug: "ramadhan-full",
    title: "Ramadhan Full Ramadhan 30 Hari",
    category: "ramadhan",
    duration: "30 Hari",
    price: 69000000,
    priceLabel: "Mulai dari",
    badge: "Special",
    badgeVariant: "destructive",
    image: "/images/Paket-Ramadhan-Full-Ramadhan-30-h.jpg",
    hotelMekah: "Hotel Dar Al Tawhid / setaraf",
    hotelMadinah: "Hotel Al Ansar / setaraf",
    maskapai: "Saudi Airlines / Garuda Indonesia",
    features: ["Hotel Bintang 3/4", "Tiket Pesawat PP", "Bus PP", "Visa Umroh", "Perlengkapan", "Sahur & Berbuka", "Pembimbing Ibadah", "Muthowif", "Manasik", "Lounge Umroh", "Handling Bandara"],
  },
  {
    id: "11",
    slug: "ramadhan-akhir",
    title: "Ramadhan Akhir Ramadhan 15 Hari",
    category: "ramadhan",
    duration: "15 Hari",
    price: 49000000,
    priceLabel: "Mulai dari",
    badge: "Special",
    badgeVariant: "destructive",
    image: "/images/Paket-Ramadhan-Akhir-Ramadhan-15-h.jpg",
    hotelMekah: "Hotel Dar Al Tawhid / setaraf",
    hotelMadinah: "Hotel Al Ansar / setaraf",
    maskapai: "Saudi Airlines / Garuda Indonesia",
    features: ["Hotel Bintang 3/4", "Tiket Pesawat PP", "Bus PP", "Visa Umroh", "Perlengkapan", "Sahur & Berbuka", "Pembimbing Ibadah", "Muthowif", "Manasik", "Lounge Umroh", "Handling Bandara"],
  },
]
