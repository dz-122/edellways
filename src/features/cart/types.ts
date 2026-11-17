export type CartItem = {
  productId: string;
  name: string;
  image: string | null;
  price: number; // hanya untuk tampilan; divalidasi ulang dari database saat checkout
  quantity: number;
};