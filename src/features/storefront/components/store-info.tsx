import { Clock, AtSign, MapPin, MessageCircle, Truck } from "lucide-react";
import { buildChatUrl } from "@/features/cart/whatsapp";
import { INFO } from "../content";
import { container } from "../styles";
import { SectionHeading } from "./section-heading";

export function StoreInfo() {
  const items = [
    { icon: MapPin, title: "Alamat", text: INFO.address },
    { icon: Clock, title: "Jam buka", text: INFO.hours },
    { icon: Truck, title: "Pengiriman", text: INFO.delivery },
  ];

  const socialLinks = [
    {
      name: "Instagram",
      url: INFO.instagramUrl,
      username: INFO.instagram,
    },
    {
      name: "TikTok",
      url: INFO.tiktokUrl,
      username: INFO.tiktok,
    },
  ];

  return (
    <section id="kontak" className={`${container} py-20`}>
      <div className="rounded-[2rem] bg-forest p-8 text-cream md:p-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionHeading
              tone="dark"
              eyebrow="Mampir atau hubungi"
              title="Kami siap membantu"
            />
            <p className="max-w-sm text-cream/75">
              Punya permintaan khusus? Ceritakan momen dan anggaranmu, kami
              bantu siapkan.
            </p>

            <a
              href={buildChatUrl(
                "Halo Edellways, saya ingin berkonsultasi soal rangkaian spesial yang cocok untuk kamu.",
              )}
              className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-cream px-6 font-medium text-forest transition hover:bg-blush"
            >
              <MessageCircle className="size-4" />
              Chat WhatsApp
            </a>
          </div>

          <ul className="grid gap-6 sm:grid-cols-2">
            {items.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-cream/10">
                  <Icon className="size-5 text-blush" />
                </span>
                <div>
                  <p className="font-display text-xl">{title}</p>
                  <p className="text-sm text-cream/75">{text}</p>
                </div>
              </li>
            ))}

            <li className="flex gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-cream/10">
                <AtSign className="size-5 text-blush" />
              </span>

              <div>
                <p className="font-display text-xl">Sosial Media</p>

                <div className="mt-1 flex flex-wrap items-center gap-1 text-sm text-cream/75">
                  {socialLinks.map((social, index) => (
                    <span key={social.name}>
                      {index > 0 && ", "}
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline-offset-4 transition hover:text-blush hover:underline"
                      >
                        {social.name}
                      </a>
                    </span>
                  ))}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
