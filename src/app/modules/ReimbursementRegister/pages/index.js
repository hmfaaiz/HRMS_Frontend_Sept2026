import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import {ReimbursementRegisterPage} from "./forms/ReimbursementRegisterPage"

export default function ReimbursementRegisterManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/reimbursement_register" to="/reimbursement_register/read-reimbursement-report" />}
        <ContentRoute path="/reimbursement_register/read-reimbursement-report" component={ReimbursementRegisterPage} />
      </Switch>
    </Suspense>
  );
}
