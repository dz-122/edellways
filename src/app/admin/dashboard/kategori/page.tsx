import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { CategoryManager } from "@/features/categories/components/category-manager";
import { getCategoryRows } from "@/features/categories/queries";

export const metadata: Metadata = { title: "Kategori" };

export default async function CategoriesPage() {
  const categories = await getCategoryRows();
  return (
    <>
      <PageHeader title="Kategori" description="Kelompokkan produk agar mudah dicari." />
      <CategoryManager categories={categories} />
    </>
  );
}
