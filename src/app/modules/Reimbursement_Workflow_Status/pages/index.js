// ReimbursementWorkflowHrmsManagement.js
import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
import { ReimbursementWorkflowHrmsPage } from "./reimbursement_workflow_status/ReimbursementWorkflowPage";

export default function ReimbursementWorkflowHrmsManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact
          from="/reimbursement_claim_workflow_status_approval"
          to="/reimbursement_claim_workflow_status_approval/read-all-reimbursement-claim-workflow-status-approval"
        />
        <ContentRoute
          path="/reimbursement_claim_workflow_status_approval/read-all-reimbursement-claim-workflow-status-approval"
          component={ReimbursementWorkflowHrmsPage}
        />
      </Switch>
    </Suspense>
  );
}