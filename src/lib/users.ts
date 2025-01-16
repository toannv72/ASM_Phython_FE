export type User = {
  id: string;
  image: string;
  userid: number;
  status: "pending" | "processing" | "success" | "failed";
  username: string;
  email: string;
  cost: number;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
  password: string;
};
export type FormData = {
  email: string;
  username: string;
  last_name: string;
  first_name: string;
  phone: string;
  password: string;
};
export type UserLoginForm = {
  username: string;
  password: string;
};

export interface UserLogin {
  refresh: string;
  access: string;
  userid: number;
  username: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  accountid: number;
}

export interface Cart {
  id: number;
  images: Image[];
  is_deleted: boolean;
  name: string;
  price: string;
  description: string;
  quantity: number;
  slug: string;
  created_at: string;
  is_active: boolean;
  category: Category;
  selected: boolean;
}

export interface Image {
  id: number;
  image: string;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  is_deleted: boolean;
}
