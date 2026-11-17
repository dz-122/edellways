import Image from "next/image";

type HeroProps = { image: string | null; productName: string | null };

export function Hero({ image = null, productName = null }: HeroProps) {
  return (
    <section className="relative h-[100vh] min-h-[420px] max-h-[650px] w-full overflow-hidden">
      <Image
        src="/images/logo.webp"
        alt="Edellways"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
    </section>
  );
}
