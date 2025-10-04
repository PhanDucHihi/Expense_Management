"use client";

import Header, { ActionType } from "../header";
import BudgetDashBoard from "./budgetDashboard";
import { Suspense } from "react";

export default function BudgetPage() {
  return (
    <div className="p-5 space-y-5">
      <Header title="Thêm mới ngân sách" actionType={ActionType.BUDGET} />
      <Suspense fallback={<div>Loading dashboard...</div>}>
        <BudgetDashBoard />
      </Suspense>
    </div>
  );
}
