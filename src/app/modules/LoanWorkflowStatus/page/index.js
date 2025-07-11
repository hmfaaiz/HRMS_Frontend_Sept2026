import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
import { LoanWorkflowStatusPage } from "./LoanWorkflowStatusPage";

export default function LoanApprovalManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/loan-workflow-status"
            to="/loan-workflow-status/read-all-loan-workflow-status"
          />
        }
        <ContentRoute
          path="/loan-workflow-status/read-all-loan-workflow-status"
          component={LoanWorkflowStatusPage}
        />
      </Switch>
    </Suspense>
  );
}
