"use client";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { NativeSelect } from "@/components/shared/native-select";
import { ProductImage } from "@/components/shared/product-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRupiah } from "@/lib/format";
import { deleteProduct, toggleProductFlag } from "../actions";
import type { CategoryOptions, ProductRow } from "../types";
import { ProductFormDialog } from "./product-form-dialog";

type StatusFilter = "" | "active" | "inactive" | "soldout";
type DialogState = { open: false } | { open: true; product: ProductRow | null };

type ProductManagerProps = { products: ProductRow[]; options: CategoryOptions };

export function ProductManager({ products, options }: ProductManagerProps) {
  const [query, setQuery] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const [occasionId, setOccasionId] = useState("");
  const [status, setStatus] = useState<StatusFilter>("");
  const [dialog, setDialog] = useState<DialogState>({ open: false });
  const [, startTransition] = useTransition();

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        if (query && !p.name.toLowerCase().includes(query.toLowerCase()))
          return false;
        if (collectionId && p.categoryId !== collectionId) return false;
        if (occasionId && !p.occasionIds.includes(occasionId)) return false;
        if (status === "active" && !p.isActive) return false;
        if (status === "inactive" && p.isActive) return false;
        if (status === "soldout" && !p.soldOut) return false;
        return true;
      }),
    [products, query, collectionId, occasionId, status],
  );

  const handleToggle = (
    id: string,
    field: "isActive" | "soldOut",
    value: boolean,
  ) =>
    startTransition(async () => {
      const result = await toggleProductFlag(id, field, value);
      if (!result.ok) toast.error(result.error);
    });

  const handleDelete = (product: ProductRow) => {
    if (
      !confirm(
        `Hapus "${product.name}"? Produk yang pernah dipakai transaksi hanya akan dinonaktifkan.`,
      )
    )
      return;
    startTransition(async () => {
      const result = await deleteProduct(product.id);
      if (!result.ok) { toast.error(result.error); return; }
      toast.success(
        result.data.archived
          ? "Produk dinonaktifkan karena punya riwayat transaksi."
          : "Produk dihapus.",
      );
    });
  };

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="relative min-w-52 flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Cari produk"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <NativeSelect
          className="w-44"
          value={collectionId}
          onChange={(e) => setCollectionId(e.target.value)}
          aria-label="Filter koleksi"
        >
          <option value="">Semua koleksi</option>
          {options.collections.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </NativeSelect>
        <NativeSelect
          className="w-44"
          value={occasionId}
          onChange={(e) => setOccasionId(e.target.value)}
          aria-label="Filter produk"
        >
          <option value="">Produk</option>
          {options.occasions.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </NativeSelect>
        <NativeSelect
          className="w-40"
          value={status}
          onChange={(e) => setStatus(e.target.value as StatusFilter)}
          aria-label="Filter status"
        >
          <option value="">Semua status</option>
          <option value="active">Aktif</option>
          <option value="inactive">Nonaktif</option>
          <option value="soldout">Sold out</option>
        </NativeSelect>
        <Button
          className="ml-auto"
          onClick={() => setDialog({ open: true, product: null })}
        >
          <Plus /> Tambah produk
        </Button>
      </div>

      <Card className="overflow-hidden py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 pl-4">Foto</TableHead>
              <TableHead>Produk</TableHead>
              <TableHead>Koleksi & Produk</TableHead>
              <TableHead className="text-right">Harga</TableHead>
              <TableHead>Aktif</TableHead>
              <TableHead>Sold out</TableHead>
              <TableHead className="pr-4 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-10 text-center text-muted-foreground"
                >
                  Tidak ada produk yang cocok.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="pl-4">
                  <ProductImage
                    src={product.image}
                    alt={product.name}
                    className="size-12 rounded-md"
                  />
                </TableCell>
                <TableCell>
                  <p className="font-medium">{product.name}</p>
                  {product.badge && (
                    <Badge variant="secondary" className="mt-1">
                      {product.badge}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <p className="text-sm">
                    {product.categoryName ?? (
                      <span className="text-muted-foreground">
                        Tanpa koleksi
                      </span>
                    )}
                  </p>
                  {product.occasionNames.length > 0 && (
                    <div className="mt-1 flex max-w-60 flex-wrap gap-1">
                      {product.occasionNames.map((name) => (
                        <Badge
                          key={name}
                          variant="outline"
                          className="font-normal"
                        >
                          {name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {formatRupiah(product.price)}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={product.isActive}
                    onCheckedChange={(v) =>
                      handleToggle(product.id, "isActive", v)
                    }
                    aria-label="Aktif"
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={product.soldOut}
                    onCheckedChange={(v) =>
                      handleToggle(product.id, "soldOut", v)
                    }
                    aria-label="Sold out"
                  />
                </TableCell>
                <TableCell className="pr-4 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Edit"
                    onClick={() => setDialog({ open: true, product })}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Hapus"
                    onClick={() => handleDelete(product)}
                  >
                    <Trash2 className="text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {dialog.open && (
        <ProductFormDialog
          key={dialog.product?.id ?? "new"}
          product={dialog.product}
          options={options}
          onClose={() => setDialog({ open: false })}
        />
      )}
    </>
  );
}
