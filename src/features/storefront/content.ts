import { SITE } from "@/config/site";
import { STORE } from "@/config/store";

export const NAV_LINKS = [
  { href: "/koleksi", label: "Koleksi" },
  { href: "/#cerita", label: "Cerita kami" },
  { href: "/#cara-pesan", label: "Cara pesan" },
  { href: "/#kontak", label: "Kontak" },
];

// Sesuaikan dengan layanan Edellways yang sebenarnya.
export const PERKS = [
  `Florist di ${SITE.city}, ${SITE.region}`,
  "Dirangkai tangan oleh florist",
  "Pesan mudah lewat WhatsApp",
  "Bisa tambah kartu ucapan",
  `Pengiriman ke alamat tujuan di ${SITE.city}`,
];

export const STEPS = [
  { title: "Pilih bunga", text: "Jelajahi koleksi dan pilih rangkaian yang paling pas untuk momenmu." },
  { title: "Masukkan keranjang", text: "Atur jumlah, lihat estimasi subtotal, dan ubah kapan saja." },
  { title: "Kirim lewat WhatsApp", text: "Satu klik, pesananmu tersusun rapi di chat dengan admin kami." },
  { title: "Konfirmasi & bayar", text: `Admin memastikan ketersediaan, total akhir, dan jadwal pengiriman di ${SITE.city}.` },
];

export const STORY = {
  title: "Cerita di balik setiap",
  accent: "rangkaian",
  paragraphs: [
    `${SITE.name} lahir di ${SITE.city}, ${SITE.region}, dari keyakinan sederhana: bunga adalah cara paling jujur untuk bilang sayang, terima kasih, atau selamat.`,
    "Setiap buket dirangkai dengan tangan, dipilih satu per satu, dan dikemas seolah akan kami berikan kepada orang tersayang.",
  ],
  values: [
    { title: "Segar", text: "Bunga dipilih dengan teliti." },
    { title: "Personal", text: "Kartu ucapan dan catatan sesuai permintaan." },
    { title: "Hangat", text: "Dilayani langsung oleh tim kami." },
  ],
};

// CONTOH: ganti dengan ulasan pelanggan asli sebelum dipublikasikan.
export const TESTIMONIALS = [
  { name: "Nama Pelanggan", occasion: "Ulang tahun", text: "Tulis ulasan asli pelanggan di sini." },
  { name: "Nama Pelanggan", occasion: "Wisuda", text: "Tulis ulasan asli pelanggan di sini." },
  { name: "Nama Pelanggan", occasion: "Anniversary", text: "Tulis ulasan asli pelanggan di sini." },
];

export const INFO = {
  address: `${SITE.streetAddress}, ${SITE.city}, ${SITE.region}`,
  hours: "Setiap hari, 10.00 - 21.00",
  delivery: `Pengiriman ke alamat tujuan di area ${SITE.city}. Biaya dan jadwal dikonfirmasi lewat WhatsApp.`, // sesuaikan
  instagram: STORE.instagram,
  tiktok: STORE.tiktok,
  instagramUrl: `https://instagram.com/${STORE.instagram.replace("@", "")}`,
  tiktokUrl: `https://tiktok.com/${STORE.tiktok.replace("@", "")}`,
};

export const LOCAL_INTRO = {
  title: "Toko bunga di Ambon untuk setiap",
  accent: "momen",
  paragraphs: [
    `${SITE.name} adalah toko bunga di ${SITE.city}, ${SITE.region}, yang merangkai buket dan rangkaian bunga untuk wisuda, wedding, ulang tahun, anniversary, hingga ucapan duka cita.`,
    "Setiap pesanan dirangkai dengan tangan. Pilih rangkaian di website, kirim pesananmu lewat WhatsApp, dan admin kami akan mengonfirmasi ketersediaan, total pembayaran, serta jadwal pengiriman.",
  ],
};

// SESUAIKAN jawaban dengan kebijakan toko yang sebenarnya sebelum dipublikasikan.
export const FAQ_ITEMS = [
  { q: `Apakah bisa memesan bunga untuk dikirim di ${SITE.city}?`, a: "Bisa. Pilih rangkaian, checkout lewat WhatsApp, lalu admin akan mengonfirmasi alamat, biaya, dan jadwal pengiriman." },
  { q: "Bagaimana cara memesan?", a: "Masukkan rangkaian ke keranjang, tekan Checkout via WhatsApp, lalu admin kami melanjutkan konfirmasi dan pembayaran." },
  { q: "Apakah bisa menambahkan kartu ucapan?", a: "Bisa. Sampaikan isi kartu ucapan atau permintaan khusus lewat WhatsApp saat checkout." },
  { q: "Berapa lama pesanan disiapkan?", a: "Tergantung jenis rangkaian dan antrean pesanan. Pesan lebih awal untuk wisuda dan hari besar. Admin akan memberi estimasi saat konfirmasi." },
  { q: "Metode pembayaran apa yang tersedia?", a: "Tunai dan non tunai. Detailnya dikonfirmasi admin saat pesanan diproses." },
];

// Teks unik per halaman landing (kunci = slug). Slug yang belum ada memakai teks bawaan.
// Tambahkan juga untuk koleksi, mis. "edell-essential", sesuai konsep koleksinya.
export const LANDING_COPY: Record<string, string> = {
  wisuda: `Rayakan hari kelulusan dengan buket wisuda dari ${SITE.name}, toko bunga di ${SITE.city}. Pilih rangkaian yang manis dan mudah dibawa untuk foto bersama, lalu pesan lewat WhatsApp sebelum hari wisudamu.`,
  wedding: `Rangkaian bunga untuk wedding di ${SITE.city}, dari buket hingga bunga ucapan selamat bagi pasangan yang berbahagia. Ceritakan kebutuhanmu lewat WhatsApp dan kami bantu menyiapkannya.`,
  "ulang-tahun": `Kejutkan orang tersayang dengan bunga ulang tahun dari ${SITE.name}. Pilih rangkaian favorit, tambahkan kartu ucapan, dan pesan lewat WhatsApp.`,
  anniversary: `Bunga anniversary untuk merayakan perjalanan berdua. Temukan rangkaian romantis dari ${SITE.name} dan pesan lewat WhatsApp.`,
  "ucapan-duka": `Sampaikan belasungkawa dengan rangkaian bunga yang sopan dan menenangkan. Hubungi kami lewat WhatsApp agar ucapan dan alamat tujuan dapat disiapkan dengan tepat.`,
  hadiah: `Bunga sebagai hadiah untuk berbagai momen spesial. Pilih rangkaian dari ${SITE.name} dan kami bantu merangkainya dengan rapi.`,
};