import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { PayrollMonthSetupPage } from "./forms/PayrollMonthPage";

export default function PayrollMonthSetupManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/payroll_month" to="/payroll_month/read-all-payroll-month" />}
        <ContentRoute path="/payroll_month/read-all-payroll-month" component={PayrollMonthSetupPage} />
      </Switch>
    </Suspense>
  );
}
