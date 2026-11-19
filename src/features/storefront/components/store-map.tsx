import { SITE } from "@/config/site";
import { container } from "../styles";

export function StoreMap() {
  const src = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL;
  if (!src) return null;
  return (
    <section className={`${container} pb-20`} aria-label="Lokasi toko">
      <iframe
        src={src}
        title={`Lokasi ${SITE.name} di ${SITE.city}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="h-80 w-full rounded-[2rem] border-0"
      />
    </section>
  );
}