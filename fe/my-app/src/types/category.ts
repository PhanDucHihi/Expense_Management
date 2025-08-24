export type Category = {
  id: number;
  name: string;
  type: "EXPENSE" | "INCOME";
  icon: string;
  parentId: number | null;
  userId: number | null;
};
