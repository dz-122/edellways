import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ProductManager } from "@/features/products/components/product-manager";
import { getCategoryOptions, getProductRows } from "@/features/products/queries";

export const metadata: Metadata = { title: "Produk" };

export default async function ProductsPage() {
  const [products, options] = await Promise.all([getProductRows(), getCategoryOptions()]);
  return (
    <>
      <PageHeader title="Produk" description="Atur katalog, harga, koleksi, acara, dan ketersediaan." />
      <ProductManager products={products} options={options} />
    </>
  );
}