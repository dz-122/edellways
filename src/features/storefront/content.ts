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
  "Buket bunga, hampers & gift box",
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

export const ABOUT = {
  eyebrow: "About Edellways",
  tagline: "Your Greeting Solutions",
  title: "Every Moment Deserves a",
  accent: "Beautiful Greeting.",
  intro: [
    "Edellways hadir dengan keyakinan bahwa setiap momen memiliki cerita dan layak disampaikan melalui cara yang indah dan bermakna.",
    "Sebagai Greeting & Gifting Brand, kami menghadirkan beragam solusi ucapan melalui keindahan bunga dan kreativitas hadiah, mulai dari flower bouquets, floral arrangements, hampers, gift boxes, hingga berbagai kreasi tematik.",
  ],
  occasionsTitle: "Celebrating Every Moment, Throughout the Year.",
  occasionsText:
    "Kami melayani berbagai kebutuhan greeting untuk momen sehari-hari maupun perayaan khusus sepanjang tahun.",
  daily: {
    title: "Daily Greetings",
    items: [
      "Birthday & Anniversary",
      "Graduation & Achievements",
      "Engagement & Wedding",
      "Congratulations & Appreciation",
      "Newborn & Baby Celebrations",
      "Get Well Soon & Thank You",
      "Farewell & Retirement",
      "Housewarming & Corporate Greetings",
    ],
  },
  seasonal: {
    title: "Seasonal & Special Occasions",
    items: [
      "Valentine’s Day & Chinese New Year",
      "Mother’s Day & Father’s Day",
      "Easter Celebration",
      "Graduation & Teacher’s Day",
      "Indonesian Independence Day",
      "Christmas & New Year",
      "Eid al-Fitr & Eid al-Adha",
      "Other Festive Celebrations",
    ],
  },
  outro: [
    "Setiap kreasi dirancang dengan perhatian terhadap detail, karakter, dan makna dari setiap momen.",
    "Lebih dari sekadar bunga dan hadiah, kami ingin menjadi bagian dari setiap cerita, ungkapan, dan kenangan yang ingin kamu sampaikan.",
  ],
  closing: [STORE.slogan, "Beautiful Flowers for Meaningful Moments."],
};

// CONTOH: ganti dengan ulasan pelanggan asli sebelum dipublikasikan.
export const TESTIMONIALS = [
  { name: "Messi", occasion: "World Cup", text: "Info lawan" },
  { name: "John Wick", occasion: "Duka Cita", text: "For ma dawg." },
  { name: "Wowo", occasion: "Anniversary", text: "For ma teddy bear." },
];

export const INFO = {
  address: `${SITE.streetAddress}, ${SITE.city}, ${SITE.region}`,
  hours: "Setiap hari, 10.00 - 21.00",
  delivery: `Pengiriman ke alamat tujuan di area ${SITE.city}. Biaya dan jadwal dikonfirmasi lewat WhatsApp.`, // sesuaikan
  instagram: STORE.instagram,
  tiktok: STORE.tiktok,
  instagramUrl: `https://instagram.com/${STORE.instagram.replace("@", "")}`,
  tiktokUrl: `https://www.tiktok.com/@${STORE.tiktok.replace(/^@/, "")}`,
};