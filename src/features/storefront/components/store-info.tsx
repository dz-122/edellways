import { Clock, Instagram, MapPin, MessageCircle, Truck } from "lucide-react";
import { buildChatUrl } from "@/features/cart/whatsapp";
import { INFO } from "../content";
import { container } from "../styles";
import { SectionHeading } from "./section-heading";

export function StoreInfo() {
  const items = [
    { icon: MapPin, title: "Alamat", text: INFO.address },
    { icon: Clock, title: "Jam buka", text: INFO.hours },
    { icon: Truck, title: "Pengiriman", text: INFO.delivery },
    { icon: Instagram, title: "Instagram", text: INFO.instagram, href: INFO.instagramUrl },
  ];
  return (
    <section id="kontak" className={`${container} py-20`}>
      <div className="rounded-[2rem] bg-forest p-8 text-cream md:p-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionHeading tone="dark" eyebrow="Mampir atau hubungi" title="Kami siap membantu"/>
            <p className="max-w-sm text-cream/75">Punya permintaan khusus? Ceritakan momen dan anggaranmu, kami bantu siapkan.</p>
            <a href={buildChatUrl("Halo Edellways, saya ingin berkonsultasi soal rangkaian bunga.")} className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-cream px-6 font-medium text-forest transition hover:bg-blush">
              <MessageCircle className="size-4" /> Chat WhatsApp
            </a>
          </div>
          <ul className="grid gap-6 sm:grid-cols-2">
            {items.map(({ icon: Icon, title, text, href }) => (
              <li key={title} className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-cream/10"><Icon className="size-5 text-blush" /></span>
                <div>
                  <p className="font-display text-xl">{title}</p>
                  {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm text-cream/75 underline-offset-4 hover:underline">{text}</a>
                  ) : (
                    <p className="text-sm text-cream/75">{text}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}