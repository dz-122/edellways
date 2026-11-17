"use client";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Minus, MessageCircle, Plus, Trash2 } from "lucide-react";
import { ProductImage } from "@/components/shared/product-image";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatRupiah } from "@/lib/format";
import { BotanicalSprig } from "@/features/storefront/components/botanical";
import { validateCart } from "../actions";
import { useCart } from "../cart-provider";
import { buildOrderUrl, hasWhatsAppNumber } from "../whatsapp";

export function CartDrawer() {
  const { items, subtotal, isOpen, setOpen, setQuantity, remove, replaceAll } =
    useCart();
  const [pending, startTransition] = useTransition();

  const checkout = () =>
    startTransition(async () => {
      if (!hasWhatsAppNumber())
        { toast.error("Nomor WhatsApp toko belum diatur."); return; }

      const result = await validateCart(
        items.map(({ productId, quantity }) => ({ productId, quantity })),
      );
      const priceChanged = result.items.some(
        (fresh) =>
          items.find((i) => i.productId === fresh.productId)?.price !==
          fresh.price,
      );
      replaceAll(result.items);

      if (result.unavailable.length || priceChanged) {
        const reasons = [
          ...result.unavailable,
          ...(priceChanged ? ["Harga ada yang diperbarui."] : []),
        ];
        { toast.warning(
          `Keranjang diperbarui. ${reasons.join(" ")} Periksa lalu checkout lagi.`,
        ); return; }
      }
      if (!result.items.length) return;
      window.location.assign(buildOrderUrl(result.items));
    });

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col gap-0 bg-cream p-0 sm:max-w-md">
        <SheetHeader className="border-b border-forest/10 p-6">
          <SheetTitle className="font-display text-3xl font-normal text-forest">
            Keranjang
          </SheetTitle>
          <SheetDescription>
            Pesanan diselesaikan lewat WhatsApp.
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <BotanicalSprig className="h-28 text-forest/30" />
            <p className="font-display text-2xl">Keranjangmu masih kosong</p>
            <Button
              asChild
              className="rounded-full bg-forest hover:bg-forest-deep"
              onClick={() => setOpen(false)}
            >
              <Link href="/koleksi">Lihat koleksi</Link>
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-5 overflow-y-auto p-6">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-4">
                  <ProductImage
                    src={item.image}
                    alt={item.name}
                    sizes="80px"
                    className="size-20 shrink-0 rounded-2xl"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-display text-lg leading-snug">
                        {item.name}
                      </p>
                      <button
                        type="button"
                        aria-label={`Hapus ${item.name}`}
                        onClick={() => remove(item.productId)}
                        className="text-ink/40 hover:text-rose"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <p className="text-sm text-ink/60">
                      {formatRupiah(item.price)}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-forest/20">
                        <button
                          type="button"
                          aria-label="Kurangi"
                          className="grid size-8 place-items-center"
                          onClick={() =>
                            setQuantity(item.productId, item.quantity - 1)
                          }
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Tambah"
                          className="grid size-8 place-items-center"
                          onClick={() =>
                            setQuantity(item.productId, item.quantity + 1)
                          }
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <p className="text-sm font-medium">
                        {formatRupiah(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <SheetFooter className="gap-3 border-t border-forest/10 p-6">
              <div className="flex items-baseline justify-between">
                <span className="text-ink/70">Estimasi subtotal</span>
                <span className="font-display text-2xl">
                  {formatRupiah(subtotal)}
                </span>
              </div>
              <p className="text-xs text-ink/55">
                Belum termasuk PPN dan ongkir. Total akhir dikonfirmasi admin.
              </p>
              <Button
                size="lg"
                disabled={pending}
                onClick={checkout}
                className="h-12 rounded-full bg-forest text-base hover:bg-forest-deep"
              >
                {pending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <MessageCircle />
                )}{" "}
                Checkout via WhatsApp
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
