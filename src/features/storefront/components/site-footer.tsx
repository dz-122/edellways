import Link from "next/link";
import { STORE } from "@/config/store";
import { buildChatUrl, NUMBER } from "@/features/cart/whatsapp";
import { INFO, NAV_LINKS } from "../content";
import { container } from "../styles";

export function SiteFooter() {
  return (
    <footer className="bg-black text-cream/80">
      <div className={`${container} grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]`}>
        <div>
          <p className="font-brand color-brand text-5xl text-cream">Edellways</p>
          <p className="color-brand max-w-xs text-[11px]">{STORE.slogan}</p>
        </div>
        <div>
          <p className="mb-3 font-display text-xl text-cream">Jelajahi</p>
          <ul className="space-y-2 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}><Link href={l.href} className="hover:text-cream">{l.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 font-display text-xl text-cream">Hubungi kami</p>
          <ul className="space-y-2 text-sm">
            <li><a href={buildChatUrl()} className="hover:text-cream">WhatsApp +{NUMBER} </a></li>
            <li><a href={INFO.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-cream">Instagram {INFO.instagram}</a></li>
            <li><a href={INFO.tiktokUrl} target="_blank" rel="noopener noreferrer" className="hover:text-cream">Tiktok {INFO.tiktok}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10 py-5 text-center text-xs text-cream/60">
        © {new Date().getFullYear()} {STORE.name}. Seluruh hak cipta dilindungi.
      </div>
    </footer>
  );
}