export type User = {
  id: number;
  name: string | null;
  email: string;
  imageUrl: string;
  hashedPassword: string;
  role: "USER" | "ADMIN";
};
