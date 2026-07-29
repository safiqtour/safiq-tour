/* eslint-disable */
const fs = require("fs")
const path = require("path")

function genReadTime(content) {
  return Math.max(1, Math.ceil(content.split(/\s+/).length / 200))
}

const articles = [
  { id: "1", title: "Tips Memilih Paket Umroh yang Tepat untuk Perjalanan Ibadah yang Nyaman",
    excerpt: "Memilih paket umroh yang tepat adalah keputusan penting yang mempengaruhi kenyamanan ibadah. Simak panduan lengkapnya dari Safiq Tour.",
    category: "Tips Perjalanan", author: "Tim Safiq Tour", date: "2026-07-15", featured: true,
    tags: ["paket umroh", "tips umroh", "travel umroh", "ibadah"],
    keywords: ["tips memilih paket umroh", "paket umroh terbaik", "travel umroh"],
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070&auto=format&fit=crop",
    content: `## Kenali Kebutuhan Anda

Setiap jamaah memiliki kebutuhan yang berbeda dalam perjalanan umroh. Ada yang mengutamakan kenyamanan hotel, ada yang fokus pada bimbingan ibadah, dan ada juga yang mencari harga terbaik. Mengenali prioritas Anda adalah langkah pertama yang krusial.

### Faktor-faktor yang Perlu Dipertimbangkan

**Durasi Perjalanan.** Paket umroh umumnya tersedia dalam durasi 9 hingga 15 hari. Pilihlah durasi yang sesuai dengan cuti dan kondisi fisik Anda.

**Akomodasi Hotel.** Lokasi hotel sangat penting. Hotel yang dekat dengan Masjidil Haram di Makkah dan Masjid Nabawi di Madinah akan menghemat waktu dan tenaga Anda.

**Maskapai Penerbangan.** Beberapa paket menawarkan penerbangan langsung dengan maskapai seperti Saudi Airlines atau Garuda Indonesia. Penerbangan langsung lebih nyaman terutama bagi jamaah lanjut usia.

## Cek Legalitas Travel

Pastikan travel umroh yang Anda pilih memiliki izin resmi PPIU (Penyelenggara Perjalanan Ibadah Umroh) dari Kementerian Agama RI. Safiq Tour telah memiliki izin resmi dan berkomitmen memberikan pelayanan terbaik.

### Tips Tambahan

- Bandingkan harga dari beberapa travel
- Baca testimoni jamaah sebelumnya
- Tanyakan fasilitas yang termasuk dalam paket
- Pastikan ada pembimbing ibadah yang berpengalaman

Dengan mempertimbangkan faktor-faktor di atas, Anda dapat memilih paket umroh yang sesuai dengan kebutuhan dan anggaran, sehingga ibadah berjalan khusyuk dan nyaman.` },

  { id: "2", title: "Persiapan Lengkap Sebelum Berangkat Umroh",
    excerpt: "Persiapan yang matang adalah kunci kelancaran ibadah umroh. Panduan persiapan dari fisik hingga mental untuk jamaah.",
    category: "Edukasi Umroh", author: "Tim Safiq Tour", date: "2026-07-12", featured: false,
    tags: ["persiapan umroh", "dokumen umroh", "perlengkapan umroh"],
    keywords: ["persiapan umroh", "dokumen umroh", "perlengkapan umroh"],
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2070&auto=format&fit=crop",
    content: `## Persiapan Fisik

Umroh membutuhkan kondisi fisik yang prima. Aktivitas seperti thawaf, sa'i, dan perjalanan antar kota memerlukan stamina yang baik.

### Latihan Fisik

Mulailah berjalan kaki secara rutin minimal 30 menit setiap hari, sebulan sebelum keberangkatan. Ini akan membantu Anda terbiasa dengan aktivitas berjalan yang cukup intens selama umroh.

## Persiapan Dokumen

- Paspor dengan masa berlaku minimal 6 bulan
- Visa umroh
- Kartu vaksinasi meningitis
- Foto 4x6 dan 3x4
- Fotokopi KTP dan KK

## Persiapan Mental dan Spiritual

Pelajari tata cara umroh, bacaan niat, doa, dan zikir yang akan diamalkan. Ikuti manasik umroh yang diselenggarakan oleh Safiq Tour sebelum keberangkatan.

## Persiapan Perlengkapan

Bawalah pakaian ihram, alas kaki yang nyaman, tas pinggang, obat-obatan pribadi, dan perlengkapan ibadah lainnya. Jangan membawa barang berlebihan yang justru merepotkan.

Dengan persiapan yang matang, Anda dapat menjalankan ibadah dengan tenang dan khusyuk.` },

  { id: "3", title: "10 Barang Wajib Dibawa Saat Umroh",
    excerpt: "Jangan sampai ketinggalan! Ini daftar 10 barang wajib yang harus Anda bawa saat perjalanan umroh.",
    category: "Tips Perjalanan", author: "Tim Safiq Tour", date: "2026-07-10", featured: false,
    tags: ["barang bawaan", "perlengkapan umroh", "tips packing"],
    keywords: ["barang wajib umroh", "perlengkapan umroh", "packing umroh"],
    image: "https://images.unsplash.com/photo-1580651315530-69c8e0026377?q=80&w=2070&auto=format&fit=crop",
    content: `## Daftar Barang Wajib

### 1. Pakaian Ihram
Bawalah minimal 2 pasang pakaian ihram untuk pria. Untuk wanita, siapkan mukena dan pakaian longgar yang nyaman.

### 2. Alas Kaki Nyaman
Gunakan sandal atau sepatu yang ringan, anti-slip, dan nyaman digunakan untuk berjalan jauh.

### 3. Tas Pinggang
Untuk menyimpan paspor, uang, dan barang berharga lainnya saat beribadah.

### 4. Obat-obatan Pribadi
Bawa obat rutin, obat maag, obat masuk angin, plester, dan minyak angin.

### 5. Alat Shalat
Mukena, sajadah tipis, dan tasbih untuk ibadah di hotel atau masjid.

### 6. Botol Minum
Botol minum ukuran 600-1000ml untuk membawa air zamzam saat beribadah.

### 7. Payung atau Topi
Melindungi dari terik matahari saat berjalan di luar ruangan.

### 8. Power Bank
Untuk mengisi daya ponsel karena Anda akan banyak menggunakan kamera dan GPS.

### 9. Snack Sehat
Kurma, kacang, dan biskuit untuk energi tambahan saat beraktivitas.

### 10. Buku Panduan
Buku tuntunan ibadah umroh atau aplikasi digital yang memuat doa dan dzikir.

Dengan membawa barang-barang ini, perjalanan ibadah Anda akan lebih nyaman dan lancar.` },

  { id: "4", title: "Keutamaan Umroh di Bulan Ramadhan: Pahala Berlipat Ganda",
    excerpt: "Rasulullah SAW bersabda bahwa umroh di bulan Ramadhan pahalanya setara dengan haji. Simak keutamaan dan persiapannya.",
    category: "Edukasi Umroh", author: "Tim Safiq Tour", date: "2026-07-08", featured: false,
    tags: ["umroh ramadhan", "keutamaan umroh", "pahala", "ramadhan"],
    keywords: ["umroh ramadhan", "keutamaan umroh ramadhan", "pahala umroh"],
    image: "https://images.unsplash.com/photo-1561715275-f44ae57a2f9a?q=80&w=2070&auto=format&fit=crop",
    content: `## Keutamaan Umroh Ramadhan

Rasulullah SAW bersabda: "Umroh di bulan Ramadhan setara dengan haji" (HR. Bukhari dan Muslim). Hadits ini menunjukkan betapa besarnya keutamaan ibadah umroh yang dilakukan di bulan suci Ramadhan.

### Mengapa Umroh Ramadhan Istimewa?

**Pahala Berlipat Ganda.** Setiap amal ibadah di bulan Ramadhan dilipatgandakan pahalanya oleh Allah SWT, termasuk ibadah umroh.

**Suasana Ibadah yang Khidmat.** Bulan Ramadhan menghadirkan atmosfer spiritual yang luar biasa di Tanah Suci, dengan ribuan jamaah yang beribadah siang dan malam.

### Persiapan Khusus

Umroh Ramadhan memerlukan persiapan ekstra. Cuaca yang lebih panas, padatnya jamaah, dan perubahan pola makan saat berpuasa perlu diantisipasi.

Safiq Tour menyediakan paket umroh Ramadhan khusus dengan fasilitas sahur dan berbuka, bimbingan ibadah intensif, serta akomodasi strategis.

Jangan lewatkan kesempatan emas meraih pahala berlipat ganda di bulan Ramadhan bersama Safiq Tour.` },

  { id: "5", title: "Tata Cara Umroh: Panduan Lengkap dari Miqat hingga Tahallul",
    excerpt: "Panduan lengkap tata cara umroh dari niat, miqat, thawaf, sa'i, hingga tahallul. Dilengkapi bacaan doa dan dzikir.",
    category: "Edukasi Umroh", author: "Ustadz Ahmad Fauzi", date: "2026-07-05", featured: false,
    tags: ["tata cara umroh", "rukun umroh", "panduan umroh", "thawaf", "sai"],
    keywords: ["tata cara umroh", "panduan umroh", "rukun umroh"],
    image: "https://images.unsplash.com/photo-1579338553550-4d3f3299ef87?q=80&w=2070&auto=format&fit=crop",
    content: `## Rukun Umroh

Umroh memiliki 5 rukun yang harus dilaksanakan. Jika salah satu ditinggalkan, umroh tidak sah.

### 1. Niat dan Ihram

Niat umroh dimulai dari miqat. Untuk jamaah dari Indonesia, miqatnya di Bir Ali (Zulhulaifah) bagi yang melalui Madinah, atau di Ji'ranah bagi yang dari Makkah.

### 2. Thawaf

Mengelilingi Ka'bah sebanyak 7 kali dimulai dari Hajar Aswad. Thawaf dilakukan dengan niatan ibadah, membaca doa, dan dzikir.

### 3. Sa'i

Berjalan atau berlari kecil antara bukit Shafa dan Marwah sebanyak 7 kali. Dimulai dari Shafa dan berakhir di Marwah.

### 4. Tahallul

Mencukur atau memotong rambut sebagai tanda selesainya ihram. Bagi pria, dianjurkan mencukur gundul. Bagi wanita, cukup memotong ujung rambut sepanjang satu ruas jari.

### 5. Tertib

Melaksanakan rukun secara berurutan sesuai tuntunan.

## Wajib Umroh

Selain rukun, ada beberapa wajib umroh yang harus diperhatikan, yaitu niat di miqat dan meninggalkan larangan ihram.

Dengan memahami tata cara ini, ibadah umroh Anda akan sah dan diterima Allah SWT.` },

  { id: "6", title: "Kumpulan Doa dan Dzikir Sepanjang Perjalanan Umroh",
    excerpt: "Kumpulan doa dan dzikir yang dibaca selama perjalanan umroh, dari keberangkatan hingga kepulangan.",
    category: "Edukasi Umroh", author: "Ustadz Ahmad Fauzi", date: "2026-07-03", featured: false,
    tags: ["doa umroh", "dzikir", "panduan doa", "ibadah"],
    keywords: ["doa umroh", "dzikir umroh", "bacaan umroh"],
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070&auto=format&fit=crop",
    content: `## Doa Keberangkatan

Sebelum berangkat, bacalah doa perjalanan dan mohon keselamatan kepada Allah SWT.

## Doa di Miqat

Saat tiba di miqat, ucapkan niat umroh: "Labbaika Allahumma Umratan" (Aku penuhi panggilan-Mu ya Allah untuk umroh).

## Doa Thawaf

Setiap putaran thawaf memiliki doa yang dianjurkan. Mulai dari istilam Hajar Aswad hingga rukun Yamani.

## Doa di Multazam

Multazam adalah area antara Hajar Aswad dan pintu Ka'bah. Ini adalah tempat mustajab untuk berdoa.

## Doa di Maqam Ibrahim

Setelah thawaf, shalat dua rakaat di belakang Maqam Ibrahim sambil membaca surat Al-Kafirun dan Al-Ikhlas.

## Doa Sa'i

Saat naik ke bukit Shafa, membaca takbir 3 kali dan berdoa. Di bukit Marwah juga membaca doa yang sama.

## Doa Setelah Tahallul

Setelah mencukur rambut, berdoalah memohon ampunan dan kebaikan dunia akhirat.

Hafalkan doa-doa ini sebelum berangkat agar ibadah lebih khusyuk dan bermakna.` },

  { id: "7", title: "Mengenal Miqat: Batas Waktu dan Tempat Ihram Umroh",
    excerpt: "Miqat adalah batas yang ditetapkan syariat untuk memulai ihram. Kenali miqat zamani dan miqat makani dalam ibadah umroh.",
    category: "Edukasi Umroh", author: "Ustadz Ahmad Fauzi", date: "2026-06-30", featured: false,
    tags: ["miqat", "ihram", "batas umroh", "tata cara"],
    keywords: ["miqat umroh", "batas ihram", "miqat makani"],
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2070&auto=format&fit=crop",
    content: `## Pengertian Miqat

Miqat secara bahasa berarti batas atau waktu yang ditentukan. Dalam ibadah haji dan umroh, miqat adalah ketentuan mengenai waktu dan tempat dimulainya ihram.

### Miqat Zamani (Batas Waktu)

Untuk umroh, miqat zamani adalah sepanjang tahun. Berbeda dengan haji yang hanya pada bulan-bulan tertentu, umroh dapat dilakukan kapan saja.

### Miqat Makani (Batas Tempat)

Terdapat 5 miqat makani yang ditetapkan Rasulullah SAW:

**1. Bir Ali (Zulhulaifah)** - Miqat untuk jamaah yang datang dari arah Madinah. Berjarak sekitar 450 km dari Makkah.

**2. Juhfah** - Miqat untuk jamaah yang datang dari arah Syam (Suriah). Sekarang banyak jamaah yang miqat di Rabigh.

**3. Qarnul Manazil** - Miqat untuk jamaah dari arah Najd (Arab Saudi bagian timur).

**4. Yalamlam** - Miqat untuk jamaah dari arah Yaman dan Asia Tenggara termasuk Indonesia.

**5. Dzatu Irq** - Miqat untuk jamaah dari arah Irak.

## Pentingnya Miqat

Melewati miqat tanpa ihram bagi yang hendak umroh adalah dosa dan wajib membayar dam (denda). Pastikan Anda sudah berniat dan berpakaian ihram sebelum melewati batas miqat.` },

  { id: "8", title: "Masjid Nabawi: Sejarah, Keutamaan, dan Panduan Ziarah",
    excerpt: "Masjid Nabawi di Madinah adalah masjid kedua paling suci dalam Islam. Simak sejarah, keutamaan, dan panduan ziarahnya.",
    category: "Sejarah Islam", author: "Tim Safiq Tour", date: "2026-06-28", featured: false,
    tags: ["masjid nabawi", "madinah", "raudhah", "ziarah"],
    keywords: ["masjid nabawi", "sejarah masjid nabawi", "raudhah"],
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070&auto=format&fit=crop",
    content: `## Sejarah Masjid Nabawi

Masjid Nabawi dibangun oleh Rasulullah SAW pada tahun 1 Hijriah (622 M) di Kota Madinah. Awalnya dibangun sederhana dari pelepah kurma dan batu bata.

### Perluasan Masjid

Masjid Nabawi telah mengalami beberapa kali perluasan, terutama pada masa Khalifah Umar bin Khattab, Utsman bin Affan, dan yang terbesar pada era Kerajaan Saudi Arabia.

## Keutamaan Masjid Nabawi

Shalat di Masjid Nabawi pahalanya 1000 kali lipat dibanding shalat di masjid lainnya, kecuali Masjidil Haram.

### Raudhah

Raudhah adalah taman surga yang terletak di antara rumah Rasulullah SAW dan mimbar. Ini adalah tempat mustajab untuk berdoa.

## Panduan Ziarah

- Mengunjungi makam Rasulullah SAW
- Shalat di Raudhah
- Melihat mihrab Utsman
- Mengunjungi Masjid Quba dan Masjid Qiblatain

Ziarah ke Masjid Nabawi adalah pengalaman spiritual yang tak terlupakan.` },

  { id: "9", title: "Masjidil Haram: Pusat Ibadah Umat Islam Sedunia",
    excerpt: "Masjidil Haram adalah masjid terbesar dan paling suci di dunia. Simak fakta menarik dan panduan beribadah di dalamnya.",
    category: "Sejarah Islam", author: "Tim Safiq Tour", date: "2026-06-25", featured: true,
    tags: ["masjidil haram", "kabah", "mekkah", "thawaf"],
    keywords: ["masjidil haram", "kabah", "hajar aswad"],
    image: "https://images.unsplash.com/photo-1561715275-f44ae57a2f9a?q=80&w=2070&auto=format&fit=crop",
    content: `## Keagungan Masjidil Haram

Masjidil Haram adalah masjid yang mengelilingi Ka'bah, kiblat umat Islam di seluruh dunia. Masjid ini disebut dalam Al-Qur'an sebagai tempat pertama kali dibangun untuk beribadah kepada Allah SWT.

### Fakta Menarik

- Kapasitas lebih dari 2 juta jamaah
- Memiliki 9 menara setinggi 89 meter
- Pintu utama berjumlah 180 pintu
- Dilengkapi pendingin ruangan dan eskalator

### Area Penting di Masjidil Haram

**Ka'bah.** Bangunan suci yang menjadi kiblat. Thawaf dilakukan mengelilingi Ka'bah sebanyak 7 kali.

**Hajar Aswad.** Batu dari surga yang diletakkan di sudut Ka'bab. Tempat memulai dan mengakhiri thawaf.

**Maqam Ibrahim.** Tempat berpijaknya Nabi Ibrahim saat membangun Ka'bah.

### Panduan Beribadah

Beribadah di Masjidil Haram membutuhkan kesabaran karena padatnya jamaah. Datanglah lebih awal, terutama saat musim puncak umroh.` },

  { id: "10", title: "Raudhah: Taman Surga di Masjid Nabawi",
    excerpt: "Raudhah adalah area yang disebut Rasulullah SAW sebagai taman surga. Panduan mendapatkan kesempatan shalat di Raudhah.",
    category: "Edukasi Umroh", author: "Ustadz Ahmad Fauzi", date: "2026-06-22", featured: false,
    tags: ["raudhah", "masjid nabawi", "taman surga", "madinah"],
    keywords: ["raudhah", "taman surga", "masjid nabawi"],
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070&auto=format&fit=crop",
    content: `## Keistimewaan Raudhah

Rasulullah SAW bersabda: "Di antara rumahku dan mimbarku terdapat taman dari taman-taman surga" (HR. Bukhari dan Muslim).

Raudhah adalah area seluas sekitar 330 meter persegi yang terletak di antara makam Rasulullah SAW dan mimbar Masjid Nabawi.

### Mengapa Disebut Taman Surga?

Para ulama menjelaskan bahwa ibadah di Raudhah dapat mendatangkan ketenangan dan keberkahan yang luar biasa, sebagaimana nikmat surga.

### Tips Mendapatkan Akses

- Datang lebih awal setelah shalat Subuh
- Registrasi melalui aplikasi Eatmarna atau Tawakkalna
- Berdoa dengan khusyuk saat berada di Raudhah

### Adab di Raudhah

- Menjaga kekhusyukan
- Tidak berisik atau berbicara duniawi
- Memperbanyak doa dan dzikir

Kesempatan shalat di Raudhah adalah pengalaman spiritual yang sangat berharga.` },

  { id: "11", title: "Hajar Aswad: Sejarah dan Keutamaan Batu dari Surga",
    excerpt: "Hajar Aswad adalah batu dari surga yang diletakkan di sudut Ka'bah. Simak sejarah dan keutamaannya dalam Islam.",
    category: "Sejarah Islam", author: "Tim Safiq Tour", date: "2026-06-20", featured: false,
    tags: ["hajar aswad", "kabah", "sejarah islam", "batu surga"],
    keywords: ["hajar aswad", "batu hitam", "kabah"],
    image: "https://images.unsplash.com/photo-1561715275-f44ae57a2f9a?q=80&w=2070&auto=format&fit=crop",
    content: `## Asal-usul Hajar Aswad

Hajar Aswad adalah batu hitam yang diyakini berasal dari surga. Diriwayatkan bahwa Malaikat Jibril membawanya dari surga dan diserahkan kepada Nabi Ibrahim AS untuk diletakkan di sudut Ka'bah.

### Warna Hajar Aswad

Awalnya Hajar Aswad berwarna putih cemerlang, namun karena dosa-dosa manusia yang menciumnya, warnanya berubah menjadi hitam.

## Keutamaan Hajar Aswad

Rasulullah SAW bersabda bahwa Hajar Aswad akan datang pada hari kiamat dan memiliki dua mata serta lisan untuk bersaksi bagi orang-orang yang menciumnya dengan ikhlas.

### Istilam Hajar Aswad

Istilam adalah menyentuh atau mencium Hajar Aswad. Jika tidak memungkinkan karena padatnya jamaah, cukup memberi isyarat tangan sambil bertakbir.

## Fakta Unik

- Hajar Aswad terdiri dari 8 pecahan kecil yang disatukan dengan bingkai perak
- Pernah dicuri oleh kelompok Qaramithah pada tahun 930 M dan dikembalikan setelah 22 tahun

Menghormati Hajar Aswad adalah bagian dari mengagungkan syiar Allah SWT.` },

  { id: "12", title: "Air Zamzam: Sejarah, Keutamaan, dan Manfaatnya",
    excerpt: "Air Zamzam adalah air yang keluar dari mata air di dekat Ka'bah. Simak sejarah dan keutamaan air Zamzam.",
    category: "Sejarah Islam", author: "Tim Safiq Tour", date: "2026-06-18", featured: false,
    tags: ["air zamzam", "mata air", "mekkah", "sejarah islam"],
    keywords: ["air zamzam", "sejarah zamzam", "manfaat zamzam"],
    image: "https://images.unsplash.com/photo-1579338553550-4d3f3299ef87?q=80&w=2070&auto=format&fit=crop",
    content: `## Sejarah Air Zamzam

Air Zamzam berasal dari kisah Siti Hajar yang berlari antara bukit Shafa dan Marwah mencari air untuk putranya, Ismail AS. Atas izin Allah, muncullah mata air dari hentakkan kaki Nabi Ismail.

### Keistimewaan Air Zamzam

Rasulullah SAW bersabda: "Air Zamzam sesuai dengan niat orang yang meminumnya" (HR. Ibnu Majah).

### Keutamaan

- Air paling mulia di muka bumi
- Tidak pernah kering sejak ribuan tahun
- Mengandung berkah dan kesembuhan
- Dapat diminum untuk apa pun yang diniatkan

### Adab Minum Air Zamzam

- Menghadap kiblat
- Membaca bismillah
- Minum dengan tiga kali napas
- Berdoa setelah minum

Jangan lupa membawa botol kosong untuk membawa air Zamzam sebagai oleh-oleh.` },

  { id: "13", title: "Mengenal Ka'bah: Kiblat Umat Islam Seluruh Dunia",
    excerpt: "Ka'bah adalah bangunan suci yang menjadi kiblat umat Islam. Simak sejarah, arsitektur, dan keutamaannya.",
    category: "Sejarah Islam", author: "Tim Safiq Tour", date: "2026-06-15", featured: false,
    tags: ["kabah", "kiblat", "mekkah", "sejarah islam"],
    keywords: ["kabah", "kiblat", "baitullah"],
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070&auto=format&fit=crop",
    content: `## Sejarah Ka'bah

Ka'bah pertama kali dibangun oleh Nabi Ibrahim AS dan putranya, Ismail AS, atas perintah Allah SWT. Sebelumnya, bangunan ini sudah ada sejak zaman Nabi Adam AS sebagai tempat ibadah pertama di bumi.

### Arsitektur Ka'bah

Ka'bah berbentuk kubus dengan tinggi sekitar 13 meter. Kain penutup Ka'bah (Kiswah) terbuat dari sutra hitam dengan ayat-ayat Al-Qur'an yang disulam dengan benang emas.

### Bagian-bagian Ka'bah

- **Hajar Aswad** - Batu hitam di sudut timur
- **Pintu Ka'bah** - Berada 2 meter dari tanah
- **Mizab** - Talang emas untuk air hujan
- **Hijir Ismail** - Area setengah lingkaran
- **Multazam** - Area mustajab untuk berdoa

### Keutamaan

Ka'bah adalah rumah Allah yang paling mulia di muka bumi. Shalat menghadap Ka'bah adalah kewajiban bagi setiap muslim yang mampu.` },

  { id: "14", title: "Jabal Rahmah: Tempat Bersejarah di Padang Arafah",
    excerpt: "Jabal Rahmah adalah bukit tempat bertemunya Nabi Adam dan Siti Hawa. Simak sejarah dan keutamaannya.",
    category: "Sejarah Islam", author: "Tim Safiq Tour", date: "2026-06-12", featured: false,
    tags: ["jabal rahmah", "arafah", "sejarah islam", "ziarah"],
    keywords: ["jabal rahmah", "bukit kasih sayang", "arafah"],
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2070&auto=format&fit=crop",
    content: `## Sejarah Jabal Rahmah

Jabal Rahmah (Bukit Kasih Sayang) terletak di Padang Arafah, sekitar 20 km dari Makkah. Bukit ini menjadi saksi pertemuan kembali Nabi Adam AS dan Siti Hawa setelah berpisah selama 40 tahun.

### Makna Spiritual

Jabal Rahmah mengajarkan tentang kasih sayang, pengampunan, dan pertemuan setelah perpisahan yang panjang. Di tempat ini, doa-doa dipanjatkan dengan penuh harap.

### Keutamaan

- Tempat mustajab untuk berdoa
- Bagian dari rangkaian wukuf di Arafah
- Mengingatkan pada kasih sayang Allah SWT

### Tips Ziarah

- Gunakan pakaian yang nyaman
- Bawa air minum yang cukup
- Berdoa dengan khusyuk

Kunjungan ke Jabal Rahmah menambah kekayaan spiritual perjalanan umroh Anda.` },

  { id: "15", title: "Masjid Quba: Masjid Pertama dalam Sejarah Islam",
    excerpt: "Masjid Quba adalah masjid pertama yang dibangun oleh Rasulullah SAW. Simak sejarah dan keutamaan shalat di dalamnya.",
    category: "Sejarah Islam", author: "Tim Safiq Tour", date: "2026-06-10", featured: false,
    tags: ["masjid quba", "sejarah islam", "madinah", "ziarah"],
    keywords: ["masjid quba", "masjid pertama", "sejarah islam"],
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070&auto=format&fit=crop",
    content: `## Sejarah Masjid Quba

Masjid Quba dibangun oleh Rasulullah SAW pada tahun 1 Hijriah, ketika beliau hijrah dari Makkah ke Madinah. Masjid ini terletak sekitar 5 km dari Masjid Nabawi.

### Keutamaan Masjid Quba

Rasulullah SAW bersabda: "Barang siapa yang bersuci di rumahnya, kemudian mendatangi Masjid Quba dan shalat di dalamnya, maka ia mendapat pahala seperti pahala umroh" (HR. Ibnu Majah).

### Panduan Ziarah

- Waktu terbaik adalah hari Sabtu (sesuai sunnah)
- Shalat 2 rakaat di dalam masjid
- Membaca doa dan dzikir

Masjid Quba buka 24 jam. Waktu terbaik untuk berkunjung adalah pagi hari setelah shalat Subuh.` },

  { id: "16", title: "Masjid Qiblatain: Saksi Perubahan Arah Kiblat",
    excerpt: "Masjid Qiblatain adalah masjid yang memiliki dua mihrab kiblat. Tempat bersejarah perubahan arah kiblat dari Baitul Maqdis ke Ka'bah.",
    category: "Sejarah Islam", author: "Tim Safiq Tour", date: "2026-06-08", featured: false,
    tags: ["masjid qiblatain", "perubahan kiblat", "madinah", "sejarah islam"],
    keywords: ["masjid qiblatain", "perubahan kiblat", "dua kiblat"],
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070&auto=format&fit=crop",
    content: `## Sejarah Masjid Qiblatain

Masjid Qiblatain terletak di Madinah, sekitar 3 km dari Masjid Nabawi. Masjid ini menjadi saksi peristiwa penting dalam sejarah Islam, yaitu turunnya wahyu tentang perubahan arah kiblat.

### Peristiwa Perubahan Kiblat

Pada bulan Rajab tahun 2 Hijriah, saat Rasulullah SAW sedang shalat bersama para sahabat, turunlah wahyu Allah SWT yang memerintahkan perubahan kiblat dari Baitul Maqdis ke Masjidil Haram.

### Keunikan Arsitektur

Masjid Qiblatain memiliki dua mihrab yang menghadap ke dua arah kiblat yang berbeda.

### Panduan Ziarah

- Berkunjung setelah shalat
- Shalat sunnah tahiyatul masjid
- Mengamati dua mihrab bersejarah

Masjid Qiblatain adalah destinasi ziarah yang sarat nilai sejarah dan spiritual.` },

  { id: "17", title: "Wisata Religi di Madinah: Destinasi Penuh Berkah",
    excerpt: "Madinah memiliki banyak tempat bersejarah dan religi. Simak panduan wisata religi di Kota Nabi ini.",
    category: "Tips Perjalanan", author: "Tim Safiq Tour", date: "2026-06-05", featured: false,
    tags: ["wisata madinah", "ziarah", "tempat bersejarah", "religi"],
    keywords: ["wisata madinah", "ziarah madinah", "tempat bersejarah madinah"],
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070&auto=format&fit=crop",
    content: `## Destinasi Wajib di Madinah

### 1. Masjid Nabawi
Masjid terpenting kedua setelah Masjidil Haram. Tempat makam Rasulullah SAW dan Raudhah.

### 2. Masjid Quba
Masjid pertama dalam sejarah Islam. Shalat di sini setara pahala umroh.

### 3. Masjid Qiblatain
Tempat bersejarah perubahan arah kiblat.

### 4. Makam Syuhada Uhud
Makam para sahabat yang syahid dalam Perang Uhud, termasuk Hamzah bin Abdul Muthalib.

### 5. Masjid Tujuh (Masjid Sab'ah)
Kompleks masjid yang dibangun di lokasi pertempuran dalam Perang Khandaq.

### Tips Wisata Religi

- Gunakan pakaian yang sopan dan nyaman
- Ikuti jadwal yang telah ditentukan pembimbing
- Jangan lupa berdoa di setiap tempat bersejarah` },

  { id: "18", title: "Wisata Religi di Makkah: Lebih dari Sekadar Umroh",
    excerpt: "Makkah memiliki banyak tempat bersejarah di luar Masjidil Haram. Simak panduan wisata religi di Kota Suci.",
    category: "Tips Perjalanan", author: "Tim Safiq Tour", date: "2026-06-02", featured: false,
    tags: ["wisata mekkah", "ziarah", "tempat bersejarah", "gua hira"],
    keywords: ["wisata mekkah", "ziarah mekkah", "gua hira", "jabal nur"],
    image: "https://images.unsplash.com/photo-1561715275-f44ae57a2f9a?q=80&w=2070&auto=format&fit=crop",
    content: `## Destinasi Wajib di Makkah

### 1. Masjidil Haram
Pusat ibadah dengan Ka'bah di dalamnya. Luangkan waktu untuk thawaf, shalat, dan berdoa.

### 2. Jabal Nur & Gua Hira
Tempat pertama kali Rasulullah SAW menerima wahyu dari Malaikat Jibril.

### 3. Jabal Tsur
Gua tempat Rasulullah SAW bersembunyi saat hijrah bersama Abu Bakar Ash-Shiddiq.

### 4. Museum Makkah
Menampilkan sejarah dan peradaban Islam di Kota Suci.

### 5. Jabal Rahmah
Bukit kasih sayang di Padang Arafah.

### Tips Berwisata

- Sesuaikan dengan jadwal ibadah
- Gunakan transportasi yang tersedia
- Bawa perlengkapan pribadi` },

  { id: "19", title: "Tips Menjaga Kesehatan Saat Umroh",
    excerpt: "Menjaga kesehatan selama umroh sangat penting. Simak tips agar tetap bugar selama beribadah di Tanah Suci.",
    category: "Tips Perjalanan", author: "Tim Safiq Tour", date: "2026-05-30", featured: false,
    tags: ["kesehatan", "tips sehat", "kebugaran", "umroh"],
    keywords: ["kesehatan umroh", "tips sehat umroh", "kebugaran"],
    image: "https://images.unsplash.com/photo-1579338553550-4d3f3299ef87?q=80&w=2070&auto=format&fit=crop",
    content: `## Persiapan Kesehatan Sebelum Berangkat

### 1. Pemeriksaan Kesehatan
Lakukan medical check-up minimal 2 minggu sebelum keberangkatan. Pastikan kondisi fisik prima.

### 2. Vaksinasi
Vaksinasi meningitis meningokokus adalah wajib. Vaksin lain seperti influenza dan pneumonia dianjurkan.

### 3. Obat-obatan Pribadi
Bawa obat rutin untuk 2 minggu, obat maag, obat masuk angin, vitamin, dan obat anti-diare.

## Tips Selama di Tanah Suci

### Menjaga Stamina
- Istirahat cukup setiap malam
- Minum air putih minimal 2 liter per hari
- Konsumsi makanan bergizi seimbang

### Menghadapi Cuaca Panas
- Gunakan payung atau topi
- Bawa botol semprot air
- Gunakan pakaian berbahan katun

### Pencegahan Penyakit
- Cuci tangan secara teratur
- Gunakan masker di tempat ramai
- Jaga kebersihan makanan

Dengan menjaga kesehatan, ibadah umroh Anda akan berjalan lancar dan khusyuk.` },

  { id: "20", title: "Panduan Packing Umroh: Bawa Secukupnya, Nikmati Selebihnya",
    excerpt: "Packing yang efisien membuat perjalanan umroh lebih nyaman. Simak panduan packing lengkap dari Safiq Tour.",
    category: "Tips Perjalanan", author: "Tim Safiq Tour", date: "2026-05-28", featured: false,
    tags: ["packing", "perlengkapan", "tips packing", "umroh"],
    keywords: ["packing umroh", "perlengkapan umroh", "barang bawaan umroh"],
    image: "https://images.unsplash.com/photo-1580651315530-69c8e0026377?q=80&w=2070&auto=format&fit=crop",
    content: `## Prinsip Packing Umroh

Bawalah barang secukupnya. Ingat, Anda akan kembali dengan oleh-oleh dan air zamzam yang memakan tempat.

### Daftar Packing

**Pakaian:**
- 2 pasang pakaian ihram (pria) atau 3-4 stel mukena (wanita)
- 4-5 pasang pakaian sehari-hari yang nyaman
- Jaket tipis untuk cuaca dingin AC masjid

**Perlengkapan Ibadah:**
- Mukena dan sajadah tipis
- Tasbih
- Buku doa atau aplikasi doa
- Al-Qur'an saku

**Obat-obatan:**
- Obat pribadi rutin
- Obat maag dan masuk angin
- Vitamin

### Tips Packing

- Gulung pakaian untuk menghemat ruang
- Gunakan packing cubes
- Sediakan tas lipat untuk oleh-oleh
- Letakkan dokumen di tas pinggang

Packing yang baik membuat perjalanan Anda lebih fokus pada ibadah.` },

  { id: "21", title: "Pentingnya Legalitas Travel Umroh: Pastikan Izin Resmi PPIU",
    excerpt: "Memilih travel umroh berizin resmi adalah kunci keamanan perjalanan ibadah. Simak cara cek legalitas travel umroh.",
    category: "Informasi Safiq Tour", author: "Tim Safiq Tour", date: "2026-05-25", featured: false,
    tags: ["legalitas", "travel resmi", "PPIU", "keamanan"],
    keywords: ["legalitas travel umroh", "PPIU", "travel resmi"],
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070&auto=format&fit=crop",
    content: `## Mengapa Legalitas Penting?

Legalitas travel umroh adalah jaminan bahwa penyelenggara perjalanan ibadah telah memenuhi standar yang ditetapkan oleh pemerintah.

### Risiko Travel Ilegal

- Pembatalan keberangkatan sepihak
- Akomodasi tidak sesuai janji
- Visa palsu atau tidak terdaftar
- Kerugian finansial yang besar

## Cara Cek Legalitas Travel

### 1. Cek di Situs Kemenag
Kunjungi situs resmi Kementerian Agama RI dan cari daftar PPIU resmi.

### 2. Minta Langsung ke Travel
Travel resmi akan dengan senang hati menunjukkan izin PPIU mereka.

### 3. Cek Reputasi Online
Baca testimoni jamaah sebelumnya di Google Review dan media sosial.

## Safiq Tour: Travel Resmi dan Terpercaya

Safiq Tour telah memiliki izin PPIU resmi dari Kementerian Agama RI. Kami berkomitmen memberikan pelayanan terbaik dengan standar keamanan dan kenyamanan tinggi.

Percayakan perjalanan ibadah Anda hanya pada travel umroh resmi dan terpercaya.` },

  { id: "22", title: "Mengapa Memilih Safiq Tour untuk Perjalanan Umroh Anda?",
    excerpt: "Ada banyak alasan mengapa Safiq Tour menjadi pilihan tepat untuk perjalanan umroh Anda. Simak keunggulan kami.",
    category: "Informasi Safiq Tour", author: "Tim Safiq Tour", date: "2026-05-22", featured: false,
    tags: ["safiq tour", "keunggulan", "travel umroh", "pelayanan"],
    keywords: ["safiq tour", "travel umroh terbaik", "keunggulan safiq tour"],
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070&auto=format&fit=crop",
    content: `## Keunggulan Safiq Tour

### 1. Izin Resmi PPIU
Safiq Tour telah terdaftar dan memiliki izin resmi dari Kementerian Agama RI sebagai Penyelenggara Perjalanan Ibadah Umroh.

### 2. Pembimbing Ibadah Berpengalaman
Setiap perjalanan didampingi pembimbing ibadah yang bersertifikat dan berpengalaman.

### 3. Akomodasi Hotel Strategis
Kami bekerja sama dengan hotel-hotel terbaik di Makkah dan Madinah dengan lokasi strategis.

### 4. Maskapai Premium
Kemitraan dengan maskapai ternama seperti Saudi Airlines, Garuda Indonesia, dan Turkish Airlines.

### 5. Harga Kompetitif
Kami menawarkan paket umroh dengan harga yang bersaing tanpa mengurangi kualitas pelayanan.

Bersama Safiq Tour, perjalanan ibadah umroh Anda akan menjadi pengalaman spiritual yang tak terlupakan.` },

  { id: "23", title: "Pelayanan Safiq Tour: Ramah, Responsif, dan Profesional",
    excerpt: "Safiq Tour berkomitmen memberikan pelayanan terbaik bagi setiap jamaah. Simak standar pelayanan kami.",
    category: "Informasi Safiq Tour", author: "Tim Safiq Tour", date: "2026-05-20", featured: false,
    tags: ["pelayanan", "safiq tour", "customer service", "profesional"],
    keywords: ["pelayanan safiq tour", "customer service", "travel umroh"],
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070&auto=format&fit=crop",
    content: `## Standar Pelayanan Safiq Tour

### Pelayanan Pra-Keberangkatan

**Konsultasi Personal.** Tim kami siap membantu Anda memilih paket umroh yang sesuai dengan kebutuhan dan anggaran.

**Bantuan Dokumen.** Kami mengurus seluruh dokumen perjalanan, termasuk visa umroh dan administrasi lainnya.

**Manasik Umroh.** Kami menyelenggarakan bimbingan manasik umroh sebelum keberangkatan.

### Pelayanan Saat Perjalanan

**Pendampingan 24 Jam.** Pembimbing ibadah kami mendampingi jamaah selama 24 jam selama di Tanah Suci.

**Transportasi Nyaman.** Kami menyediakan transportasi bus berpendingin untuk perjalanan antar kota.

**Konsumsi Terjamin.** Makanan halal dan bergizi disediakan selama perjalanan.

### Pelayanan Pasca-Keberangkatan

**Dukungan Purna Jual.** Tim kami tetap siap membantu jika ada keperluan setelah kepulangan.

Kepuasan jamaah adalah prioritas utama kami.` },

  { id: "24", title: "Testimoni Jamaah: Pengalaman Berharga Bersama Safiq Tour",
    excerpt: "Simak kisah dan pengalaman jamaah yang telah mempercayakan perjalanan umroh mereka kepada Safiq Tour.",
    category: "Dokumentasi Jamaah", author: "Tim Safiq Tour", date: "2026-05-18", featured: false,
    tags: ["testimoni", "jamaah", "pengalaman", "safiq tour"],
    keywords: ["testimoni safiq tour", "pengalaman jamaah", "review umroh"],
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070&auto=format&fit=crop",
    content: `## Testimoni Jamaah

### Ibu Siti Nurhaliza (Jakarta)
"Alhamdulillah, perjalanan umroh bersama Safiq Tour sangat nyaman. Pembimbingnya sabar dan informatif. Hotel dekat Masjidil Haram, tidak perlu naik bus. Sangat recommended!"

### Bapak Ahmad Rasyid (Bandung)
"Ini umroh kedua saya bersama Safiq Tour. Pelayanannya semakin baik. Terima kasih Safiq Tour."

### Ibu Dewi Sartika (Surabaya)
"Pertama kali umroh, awalnya khawatir, tapi ternyata semua berjalan lancar. Tim Safiq Tour sangat membantu dari pendaftaran sampai kepulangan."

### Bapak Hendra Gunawan (Medan)
"Paket Zamzam Express sangat worth it. Harga terjangkau tapi fasilitasnya lengkap. Terima kasih Safiq Tour!"

Kami berkomitmen untuk terus meningkatkan kualitas pelayanan demi kepuasan jamaah.` },

  { id: "25", title: "Dokumentasi Perjalanan Umroh Jamaah Safiq Tour",
    excerpt: "Lihat dokumentasi perjalanan umroh jamaah Safiq Tour, dari keberangkatan hingga ibadah di Tanah Suci.",
    category: "Dokumentasi Jamaah", author: "Tim Safiq Tour", date: "2026-05-15", featured: false,
    tags: ["dokumentasi", "galeri", "foto jamaah", "perjalanan"],
    keywords: ["dokumentasi umroh", "galeri safiq tour", "foto jamaah"],
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070&auto=format&fit=crop",
    content: `## Dokumentasi Perjalanan

### Keberangkatan
Momen keberangkatan jamaah Safiq Tour dari bandara menuju Tanah Suci. Semua jamaah mendapatkan pendampingan penuh sejak dari bandara.

### Ibadah di Masjidil Haram
Jamaah Safiq Tour melaksanakan thawaf, sa'i, dan ibadah lainnya di Masjidil Haram dengan bimbingan pembimbing ibadah yang berpengalaman.

### Ziarah di Madinah
Kunjungan ke Masjid Nabawi, Raudhah, dan tempat bersejarah lainnya di Madinah.

### Kebersamaan Jamaah
Suasana kebersamaan jamaah Safiq Tour selama perjalanan, menciptakan ikatan persaudaraan yang erat.

Dokumentasi lengkap dapat dilihat di halaman galeri website Safiq Tour.` },

  { id: "26", title: "Promo Umroh Safiq Tour: Dapatkan Harga Terbaik",
    excerpt: "Safiq Tour menawarkan promo umroh menarik. Dapatkan harga terbaik untuk perjalanan ibadah Anda.",
    category: "Informasi Safiq Tour", author: "Tim Safiq Tour", date: "2026-05-12", featured: false,
    tags: ["promo", "diskon", "paket umroh", "harga spesial"],
    keywords: ["promo umroh", "diskon umroh", "paket umroh murah"],
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070&auto=format&fit=crop",
    content: `## Promo Terbaru Safiq Tour

### Early Bird Discount
Dapatkan diskon spesial untuk pendaftaran 3 bulan sebelum keberangkatan. Semakin awal mendaftar, semakin besar diskon.

### Promo Group
Ajak keluarga atau teman Anda! Dapatkan harga spesial untuk pendaftaran rombongan minimal 5 orang.

### Promo Spesial Bulan Ini
Setiap bulan ada promo berbeda. Cek halaman paket kami untuk informasi promo terbaru.

## Cara Mendapatkan Promo

1. Kunjungi website
2. Hubungi CS
3. Daftar sekarang

### Syarat dan Ketentuan

- Promo berlaku untuk paket tertentu
- Kuota terbatas
- Harga dapat berubah tanpa pemberitahuan

Jangan lewatkan kesempatan mendapatkan harga terbaik untuk perjalanan umroh Anda.` },

  { id: "27", title: "Panduan Lengkap Visa Umroh 2026",
    excerpt: "Proses pengurusan visa umroh semakin mudah. Simak panduan lengkap visa umroh terbaru tahun 2026.",
    category: "Tips Perjalanan", author: "Tim Safiq Tour", date: "2026-05-10", featured: false,
    tags: ["visa umroh", "dokumen", "perizinan", "administrasi"],
    keywords: ["visa umroh", "syarat visa umroh", "pengurusan visa"],
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2070&auto=format&fit=crop",
    content: `## Jenis Visa Umroh

Visa umroh adalah izin masuk ke Arab Saudi untuk tujuan ibadah umroh. Visa ini berbeda dengan visa turis atau visa kerja.

### Persyaratan Visa Umroh

- Paspor dengan masa berlaku minimal 6 bulan
- Pas foto 4x6 cm latar putih (2 lembar)
- Fotokopi KTP dan KK
- Buku nikah (untuk pasangan suami istri)
- Kartu vaksinasi meningitis
- Tiket pesawat PP
- Voucher hotel

### Prosedur Pengajuan

Safiq Tour akan mengurus seluruh proses pengajuan visa umroh untuk Anda. Proses biasanya memakan waktu 5-10 hari kerja.

## Tips Penting

- Pastikan paspor masih berlaku minimal 7 bulan
- Periksa nama di tiket sesuai dengan paspor
- Simpan fotokopi paspor terpisah dari aslinya

Dengan pengurusan visa yang baik, perjalanan umroh Anda akan lancar.` },

  { id: "28", title: "Kesalahan yang Sering Dilakukan Jamaah Umroh Pemula",
    excerpt: "Hindari kesalahan-kesalahan umum yang sering dilakukan jamaah umroh pemula.",
    category: "Tips Perjalanan", author: "Tim Safiq Tour", date: "2026-05-08", featured: false,
    tags: ["tips umroh", "kesalahan umroh", "jamaah pemula", "panduan"],
    keywords: ["kesalahan umroh", "tips umroh pemula", "panduan umroh"],
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070&auto=format&fit=crop",
    content: `## Kesalahan Umum Jamaah Pemula

### 1. Persiapan Fisik yang Kurang
Banyak jamaah meremehkan aktivitas fisik selama umroh.

**Solusi:** Mulailah latihan jalan kaki rutin sebulan sebelum keberangkatan.

### 2. Packing Berlebihan
Membawa terlalu banyak barang justru merepotkan.

**Solusi:** Bawa secukupnya, sisakan ruang untuk oleh-oleh.

### 3. Tidak Mempelajari Tata Cara Umroh
Beberapa jamaah tidak mempelajari tata cara umroh sebelumnya.

**Solusi:** Ikuti manasik umroh dan pelajari panduan sebelum berangkat.

### 4. Lupa Menjaga Kesehatan
Cuaca panas dan perubahan jam tidur dapat menurunkan daya tahan tubuh.

**Solusi:** Minum cukup, istirahat teratur, dan konsumsi vitamin.

### 5. Boros Saat Belanja
Banyak jamaah tergoda berbelanja berlebihan.

**Solusi:** Buat daftar belanjaan dan patuhi anggaran.

Dengan menghindari kesalahan-kesalahan ini, perjalanan umroh Anda akan lebih bermakna.` },

  { id: "29", title: "Tips Ibadah Khusyuk Selama di Tanah Suci",
    excerpt: "Ibadah khusyuk adalah dambaan setiap jamaah. Simak tips untuk menjaga kekhusyukan ibadah selama di Tanah Suci.",
    category: "Edukasi Umroh", author: "Ustadz Ahmad Fauzi", date: "2026-05-05", featured: false,
    tags: ["khusyuk", "ibadah", "tips ibadah", "spiritual"],
    keywords: ["ibadah khusyuk", "tips ibadah", "khusyuk umroh"],
    image: "https://images.unsplash.com/photo-1561715275-f44ae57a2f9a?q=80&w=2070&auto=format&fit=crop",
    content: `## Makna Khusyuk

Khusyuk berarti hadirnya hati dan pikiran dalam setiap ibadah. Di Tanah Suci, kekhusyukan menjadi semakin penting.

### Persiapan Mental

**Niat yang Ikhlas.** Luruskan niat hanya karena Allah SWT.

**Perbanyak Ilmu.** Pelajari tata cara umroh sebelum berangkat.

## Tips Khusyuk

### 1. Jauhi Gadget
Kurangi penggunaan ponsel untuk hal-hal duniawi.

### 2. Fokus pada Ibadah
Jangan biarkan obrolan duniawi mengganggu waktu ibadah.

### 3. Perbanyak Doa
Gunakan setiap kesempatan untuk berdoa, terutama di tempat-tempat mustajab.

### 4. Jaga Pandangan
Jaga pandangan dari hal-hal yang dapat mengurangi kekhusyukan.

### 5. Berteman dengan Jamaah Saleh
Bergaul dengan jamaah yang saleh dapat membantu menjaga semangat ibadah.

Semoga tips ini membantu Anda meraih ibadah umroh yang khusyuk dan mabrur.` },

  { id: "30", title: "Panduan Umroh Lengkap: Dari A sampai Z untuk Jamaah Pemula",
    excerpt: "Panduan umroh terlengkap untuk jamaah pemula. Dari persiapan awal, pelaksanaan ibadah, hingga kepulangan.",
    category: "Edukasi Umroh", author: "Tim Safiq Tour", date: "2026-05-02", featured: true,
    tags: ["panduan umroh", "pemula", "lengkap", "A-Z"],
    keywords: ["panduan umroh lengkap", "umroh a-z", "panduan pemula"],
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070&auto=format&fit=crop",
    content: `## Panduan Umroh Lengkap

### A. Persiapan Awal

**1. Niat dan Doa.** Mulailah dengan niat yang tulus.

**2. Pilih Paket.** Pilih paket umroh yang sesuai dengan kebutuhan.

**3. Urus Dokumen.** Siapkan paspor, visa, dan dokumen lainnya.

**4. Persiapan Fisik.** Latihan jalan kaki dan jaga kesehatan.

**5. Belajar Manasik.** Ikuti manasik umroh.

### B. Pelaksanaan Ibadah

**1. Ihram.** Niat umroh dari miqat.

**2. Thawaf.** 7 kali mengelilingi Ka'bah.

**3. Sa'i.** Berlari kecil antara Shafa dan Marwah.

**4. Tahallul.** Mencukur atau memotong rambut.

### C. Tips Selama di Tanah Suci

- Jaga kesehatan dengan istirahat cukup
- Perbanyak doa di tempat mustajab
- Manfaatkan waktu untuk ibadah sunnah
- Belanja secukupnya

### D. Tips Setelah Kepulangan

- Istiqomah dalam ibadah
- Bagikan pengalaman kepada keluarga
- Jaga silaturahmi dengan jamaah lain

Dengan panduan ini, semoga perjalanan umroh pertama Anda berjalan lancar dan penuh keberkahan.` },
]

for (const article of articles) {
  const slugs = {
    "Tips Memilih Paket Umroh yang Tepat untuk Perjalanan Ibadah yang Nyaman": "tips-memilih-paket-umroh",
    "Persiapan Lengkap Sebelum Berangkat Umroh": "persiapan-lengkap-umroh",
    "10 Barang Wajib Dibawa Saat Umroh": "barang-wajib-umroh",
    "Keutamaan Umroh di Bulan Ramadhan: Pahala Berlipat Ganda": "keutamaan-umroh-ramadhan",
    "Tata Cara Umroh: Panduan Lengkap dari Miqat hingga Tahallul": "tata-cara-umroh-lengkap",
    "Kumpulan Doa dan Dzikir Sepanjang Perjalanan Umroh": "doa-dzikir-umroh",
    "Mengenal Miqat: Batas Waktu dan Tempat Ihram Umroh": "mengenal-miqat-umroh",
    "Masjid Nabawi: Sejarah, Keutamaan, dan Panduan Ziarah": "masjid-nabawi-sejarah-ziarah",
    "Masjidil Haram: Pusat Ibadah Umat Islam Sedunia": "masjidil-haram-pusat-ibadah",
    "Raudhah: Taman Surga di Masjid Nabawi": "raudhah-taman-surga",
    "Hajar Aswad: Sejarah dan Keutamaan Batu dari Surga": "hajar-aswad-sejarah-keutamaan",
    "Air Zamzam: Sejarah, Keutamaan, dan Manfaatnya": "air-zamzam-sejarah-manfaat",
    "Mengenal Ka'bah: Kiblat Umat Islam Seluruh Dunia": "mengenal-kabah-kiblat-islam",
    "Jabal Rahmah: Tempat Bersejarah di Padang Arafah": "jabal-rahmah-sejarah",
    "Masjid Quba: Masjid Pertama dalam Sejarah Islam": "masjid-quba-sejarah",
    "Masjid Qiblatain: Saksi Perubahan Arah Kiblat": "masjid-qiblatain-sejarah",
    "Wisata Religi di Madinah: Destinasi Penuh Berkah": "wisata-religi-madinah",
    "Wisata Religi di Makkah: Lebih dari Sekadar Umroh": "wisata-religi-mekkah",
    "Tips Menjaga Kesehatan Saat Umroh": "kesehatan-saat-umroh",
    "Panduan Packing Umroh: Bawa Secukupnya, Nikmati Selebihnya": "packing-umroh-panduan",
    "Pentingnya Legalitas Travel Umroh: Pastikan Izin Resmi PPIU": "legalitas-travel-umroh",
    "Mengapa Memilih Safiq Tour untuk Perjalanan Umroh Anda?": "mengapa-memilih-safiq-tour",
    "Pelayanan Safiq Tour: Ramah, Responsif, dan Profesional": "pelayanan-safiq-tour",
    "Testimoni Jamaah: Pengalaman Berharga Bersama Safiq Tour": "testimoni-jamaah-safiq-tour",
    "Dokumentasi Perjalanan Umroh Jamaah Safiq Tour": "dokumentasi-jamaah-safiq-tour",
    "Promo Umroh Safiq Tour: Dapatkan Harga Terbaik": "promo-umroh-safiq-tour",
    "Panduan Lengkap Visa Umroh 2026": "panduan-visa-umroh-2026",
    "Kesalahan yang Sering Dilakukan Jamaah Umroh Pemula": "kesalahan-jamaah-umroh-pemula",
    "Tips Ibadah Khusyuk Selama di Tanah Suci": "tips-ibadah-khusyuk-tanah-suci",
    "Panduan Umroh Lengkap: Dari A sampai Z untuk Jamaah Pemula": "panduan-umroh-lengkap-a-z",
  }
  const slug = slugs[article.title]
  if (!slug) {
    console.error("No slug for:", article.title)
    continue
  }

  const readTime = genReadTime(article.content)
  const tagsStr = article.tags.map(t => `  - "${t}"`).join("\n")
  const keywordsStr = article.keywords.map(k => `  - "${k}"`).join("\n")

  const frontmatter = `---
title: "${article.title}"
description: "${article.excerpt}"
date: "${article.date}"
author: "${article.author}"
category: "${article.category}"
featured: ${article.featured}
featuredImage: "${article.image}"
readTime: ${readTime}
tags:
${tagsStr}
keywords:
${keywordsStr}
---

`

  const filePath = path.join(__dirname, "..", "content", "blog", `${slug}.mdx`)
  fs.writeFileSync(filePath, frontmatter + article.content)
  console.log(`Created: ${slug}.mdx`)
}
