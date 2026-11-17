export type ProductRow = {
  id: string;
  name: string;
  description: string;
  image: string | null;
  categoryId: string | null; // koleksi
  categoryName: string | null;
  occasionIds: string[];
  occasionNames: string[];
  price: number;
  isActive: boolean;
  soldOut: boolean;
  badge: string | null;
};

export type ProductFormValues = {
  name: string;
  description: string;
  image: string;
  categoryId: string; // koleksi ("" = tanpa koleksi)
  occasionIds: string[];
  price: string;
  badge: string;
  isActive: boolean;
  soldOut: boolean;
};

export type CategoryOption = { id: string; name: string };
export type CategoryOptions = { collections: CategoryOption[]; occasions: CategoryOption[] };