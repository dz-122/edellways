import type { CategoryType } from "./constants";

export type CategoryRow = { id: string; name: string; slug: string; type: CategoryType; productCount: number };