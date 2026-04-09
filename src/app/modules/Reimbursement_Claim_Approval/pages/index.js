import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
import { ReimbursementApprovalPage } from "../pages/reimbursement_claim_approval/ReimbursementApprovalPage";

export default function ReimbursementApprovalManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact
          from="/reimbursement_claim_approval"
          to="/reimbursement_claim_approval/read-all-reimbursement-claim-approval"
        />
        <ContentRoute
          path="/reimbursement_claim_approval/read-all-reimbursement-claim-approval"
          component={ReimbursementApprovalPage}
        />
      </Switch>
    </Suspense>
  );
}