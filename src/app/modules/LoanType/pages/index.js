import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { LoanType } from "./banks/BanksPage";

export default function LoanTypeManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/loan_type" to="/loan_type/read-all-loan-type" />}
        <ContentRoute path="/loan_type/read-all-loan-type" component={LoanType} />
      </Switch>
    </Suspense>
  );
}
