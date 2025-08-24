import { Button } from "@/components/ui/button";
import TransactionTale from "./(table)/page";

export default function Transaction() {
  return (
    <div className="p-5">
      <div className="flex justify-end mb-4">
        <Button className="cursor-pointer" variant="destructive">
          Thêm giao dịch
        </Button>
      </div>
      <TransactionTale />
    </div>
  );
}
