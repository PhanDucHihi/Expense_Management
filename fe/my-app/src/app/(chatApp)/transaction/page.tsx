import TransactionTale from "./(table)/page";
import Header from "../header";

export default function Transaction() {
  return (
    <div className="p-5 space-y-5">
      <Header title="Thêm mới giao dịch"/>
      <TransactionTale />
    </div>
  );
}
