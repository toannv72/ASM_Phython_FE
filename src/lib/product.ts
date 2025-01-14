export type Product = {
  name: string;
  price: string;
  rating: number;
  images: Image[];
  colors: { name: string; bgColor: string; selectedColor: string }[];
  description: string;
  quantity: number;
  details: { name: string; items: string[] }[];
};

export type Image = {
  id: number;
  image: string;
  created_at: number;
};