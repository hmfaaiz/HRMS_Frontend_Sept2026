import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
import { LoanApprovalPage } from "./LoanApprovalPage";

export default function LoanApprovalManagement() {
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
          component={LoanApprovalPage}
        />
      </Switch>
    </Suspense>
  );
}
