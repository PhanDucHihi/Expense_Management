"use client";

import Header, { ActionType } from "../header";
import BudgetDashBoard from "./budgetDashboard";

export default function BudgetPage() {
  return (
    <div className="p-5 space-y-5">
      <Header title="Thêm mới ngân sách" actionType={ActionType.BUDGET} />
      <BudgetDashBoard />
    </div>
  );
}
