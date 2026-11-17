import Image from "next/image";
import { ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";

const CLOUDINARY_PREFIX = "https://res.cloudinary.com/";

type ProductImageProps = {
  src: string | null;
  alt?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/** Gambar produk. Host Cloudinary dioptimasi Next.js; URL dari host lain ditampilkan apa adanya. */
export function ProductImage({ src, alt = "", className, sizes = "96px", priority = false }: ProductImageProps) {
  if (!src) {
    return (
      <div className={cn("grid place-items-center bg-muted text-muted-foreground", className)}>
        <ImagePlus className="size-4" />
      </div>
    );
  }
  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" unoptimized={!src.startsWith(CLOUDINARY_PREFIX)} />
    </div>
  );
}