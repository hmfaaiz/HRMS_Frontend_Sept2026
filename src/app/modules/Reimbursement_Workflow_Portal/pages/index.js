import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
import { ReimbursementWorkflowStatusPage } from "./reimbursement_workflow_portal/ReimbursementWorkflowStatusPage";

export default function ReimbursementWorkflowStatus() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact={true}
          from="/reimbursement_claim_workflow_status"
          to="/reimbursement_claim_workflow_status/read-all-reimbursement-claim-workflow-status"
        />
        <ContentRoute
          path="/reimbursement_claim_workflow_status/read-all-reimbursement-claim-workflow-status"
          component={ReimbursementWorkflowStatusPage}
        />
      </Switch>
    </Suspense>
  );
}