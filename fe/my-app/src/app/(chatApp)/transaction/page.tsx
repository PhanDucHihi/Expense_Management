"use client";

import TransactionTale from "./(table)/page";
import Header, { ActionType } from "../header";

export default function Transaction() {
  return (
    <div className="p-5 space-y-5">
      <Header title="Thêm mới giao dịch" actionType={ActionType.TRANSACTION} />
      <TransactionTale />
    </div>
  );
}
