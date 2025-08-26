// components/transactionColumns.tsx
import { Transaction } from "@/types/transition";
import { ColumnDef } from "@tanstack/react-table";

export const transactionColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "transaction_date",
    header: "Date",
    cell: ({ row }) =>
      new Date(row.original.transaction_date).toLocaleDateString(),
  },
  {
    accessorKey: "note",
    header: "Note",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => row.original.category?.name,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <span
        className={
          row.original.category.type === "EXPENSE"
            ? "text-red-500"
            : "text-green-500"
        }
      >
        {row.original.category.type}
      </span>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => Number(row.original.amount).toLocaleString(),
  },
];
