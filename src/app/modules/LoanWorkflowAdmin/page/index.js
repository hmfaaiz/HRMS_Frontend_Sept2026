import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
import { LoanApprovalPage } from "./LoanApprovalPage";

export default function LoanWorkflowManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/loan_workflow"
            to="/loan_workflow/read-all-loan-workflow-status"
          />
        }
        <ContentRoute
          path="/loan_workflow/read-all-loan-workflow-status"
          component={LoanApprovalPage}
        />
      </Switch>
    </Suspense>
  );
}
