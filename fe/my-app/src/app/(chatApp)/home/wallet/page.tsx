import Header from "../../header";
import MyWallets from "./myWallets";

export default async function WalletsPage() {
  return (
    <div className="px-5">
      <Header title="Thêm mới ví"/>
      <MyWallets />
    </div>
  );
}
