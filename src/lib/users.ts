export type User = {
  id: string;
  avatar: string;
  status: "pending" | "processing" | "success" | "failed";
  mail: string;
  cost: number;
  name: string;
  phone: string;
  role: string;
  password: string;
};
