import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
import { BudgetApprovalPage } from "./BudgetApprovalPage";

export default function BudgetApprovalManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/department_wise_budget_approval"
            to="/department_wise_budget_approval/read-all-budget-approval"
          />
        }
        <ContentRoute
          path="/department_wise_budget_approval/read-all-budget-approval"
          component={BudgetApprovalPage}
        />
      </Switch>
    </Suspense>
  );
}
