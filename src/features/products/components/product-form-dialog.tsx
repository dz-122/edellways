"use client";
import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { ImagePlus, Loader2, X } from "lucide-react";
import { NativeSelect } from "@/components/shared/native-select";
import { ProductImage } from "@/components/shared/product-image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { saveProduct } from "../actions";
import type { CategoryOptions, ProductFormValues, ProductRow } from "../types";

type ProductFormDialogProps = {
  product: ProductRow | null; // null = produk baru
  options: CategoryOptions;
  onClose: () => void;
};

export function ProductFormDialog({ product, options, onClose }: ProductFormDialogProps) {
  const [values, setValues] = useState<ProductFormValues>({
    name: product?.name ?? "",
    description: product?.description ?? "",
    image: product?.image ?? "",
    categoryId: product?.categoryId ?? "",
    occasionIds: product?.occasionIds ?? [],
    price: product ? String(product.price) : "",
    badge: product?.badge ?? "",
    isActive: product?.isActive ?? true,
    soldOut: product?.soldOut ?? false,
  });
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();
  const fileInput = useRef<HTMLInputElement>(null);

  const setField = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  const toggleOccasion = (id: string) =>
    setField("occasionIds", values.occasionIds.includes(id) ? values.occasionIds.filter((x) => x !== id) : [...values.occasionIds, id]);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const json: { url?: string; error?: string } = await res.json();
      if (!res.ok || !json.url) { toast.error(json.error ?? "Upload gagal."); return; }
      setField("image", json.url);
    } catch {
      toast.error("Upload gagal. Periksa koneksi lalu coba lagi.");
    } finally {
      setUploading(false);
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    startTransition(async () => {
      const result = await saveProduct(product?.id ?? null, values);
      if (!result.ok) { toast.error(result.error); return; }
      toast.success(product ? "Perubahan disimpan." : "Produk ditambahkan.");
      onClose();
    });
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{product ? "Edit produk" : "Tambah produk"}</DialogTitle>
          <DialogDescription>Harga dalam Rupiah, tanpa titik.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama produk</Label>
            <Input id="name" value={values.name} onChange={(e) => setField("name", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea id="description" rows={3} value={values.description} onChange={(e) => setField("description", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="price">Harga</Label>
              <Input id="price" type="number" min={0} value={values.price} onChange={(e) => setField("price", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collection">Koleksi</Label>
              <NativeSelect id="collection" value={values.categoryId} onChange={(e) => setField("categoryId", e.target.value)}>
                <option value="">Tanpa koleksi</option>
                {options.collections.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </NativeSelect>
            </div>
          </div>

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">Cocok untuk acara</legend>
            {options.occasions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Belum ada acara. <Link href="/admin/dashboard/kategori" className="underline">Tambahkan di menu Kategori</Link>.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {options.occasions.map((o) => {
                  const on = values.occasionIds.includes(o.id);
                  return (
                    <button
                      key={o.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleOccasion(o.id)}
                      className={cn("rounded-full border px-3 py-1 text-sm transition", on ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted")}
                    >
                      {o.name}
                    </button>
                  );
                })}
              </div>
            )}
          </fieldset>

          <div className="space-y-2">
            <Label htmlFor="badge">Badge (opsional)</Label>
            <Input id="badge" placeholder="Best seller" value={values.badge} onChange={(e) => setField("badge", e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Gambar</Label>
            <div className="flex items-center gap-3">
              <ProductImage src={values.image || null} alt="Pratinjau" sizes="80px" className="size-20 shrink-0 rounded-lg border" />
              <div className="flex flex-col gap-2">
                <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={handleUpload} />
                <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => fileInput.current?.click()}>
                  {uploading ? <Loader2 className="animate-spin" /> : <ImagePlus />} {values.image ? "Ganti gambar" : "Upload ke Cloudinary"}
                </Button>
                {values.image && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => setField("image", "")}>
                    <X /> Hapus gambar
                  </Button>
                )}
                <p className="text-xs text-muted-foreground">JPG, PNG, atau WebP. Maksimal 4 MB.</p>
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={values.isActive} onCheckedChange={(v) => setField("isActive", v)} /> Aktif
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={values.soldOut} onCheckedChange={(v) => setField("soldOut", v)} /> Sold out
            </label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
            <Button type="submit" disabled={pending || uploading}>
              {pending && <Loader2 className="animate-spin" />} Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}