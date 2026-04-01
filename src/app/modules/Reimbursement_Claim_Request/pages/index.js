import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./reimbursement_claim_request/FormPage";

export default function ReimbursementClaim() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact={true}
          from="/reimbursement_claim_request"
          to="/reimbursement_claim_request/read-all-reimbursement-claim-request"
        />
        <ContentRoute
          path="/reimbursement_claim_request/read-all-reimbursement-claim-request"
          component={FormPage}
        />
      </Switch>
    </Suspense>
  );
}