import BannerSlider from "./bannerSlider";
import MonthReport from "./monthReport";
import RecentTransactions from "./recentTransactions";
import TopSpending from "./topSpending";
import WalletList from "./walletList";

export default function Home() {
  return (
    <>
      <div className="px-5 space-y-10 flex flex-col items-center w-full mb-10">
        <BannerSlider />
        <WalletList />
        <div className="space-y-10 w-full flex flex-col items-center">
          <MonthReport />
          <RecentTransactions />
          <TopSpending />
        </div>
      </div>
    </>
  );
}
