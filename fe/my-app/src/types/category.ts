export type Category = {
  id: number;
  name: string;
  type: CategoryType;
  icon: string;
  parentId: number | null;
  userId: number | null;
  children?: Category[];
};

export enum CategoryType {
  EXPENSE = "EXPENSE",
  INCOME = "INCOME",
}
