export type Product = {
  id: string;
  name: string;
  price: number;
  rating: number;
  images: Image[];
  colors: { name: string; bgColor: string; selectedColor: string }[];
  description: string;
  quantity: number;
  selected: boolean;
  details: { name: string; items: string[] }[];
};

export type Image = {
  id: number;
  image: string;
  created_at: number;
};