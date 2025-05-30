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
            from="/loan_approval"
            to="/loan_approval/read-all-loan-approval"
          />
        }
        <ContentRoute
          path="/loan_approval/read-all-loan-approval"
          component={LoanApprovalPage}
        />
      </Switch>
    </Suspense>
  );
}
