"use client";

import Header, { ActionType } from "../../header";
import MyWallets from "./myWallets";

export default function WalletsPage() {
  return (
    <div className="px-5 mb-5">
      <Header title="Thêm mới ví" actionType={ActionType.WALLET} />
      <MyWallets />
    </div>
  );
}
