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

export type UserLoginForm = {
  username: string;
  password: string;
};
