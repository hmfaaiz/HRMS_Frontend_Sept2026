import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { LoanRegisterPage } from "./forms/LoanRegisterPage";

export default function LoanRegisterManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/loan_register" to="/loan_register/read-loan-register-report" />}
        <ContentRoute path="/loan_register/read-loan-register-report" component={LoanRegisterPage} />
      </Switch>
    </Suspense>
  );
}
