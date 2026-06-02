import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { ClosePayrollMonthSetupPage } from "./forms/ClosePayrollMonthPage";

export default function ClosePayrollMonthSetupManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/close_payroll_month" to="/close_payroll_month/read-all-close-payroll-month" />}
        <ContentRoute path="/close_payroll_month/read-all-close-payroll-month" component={ClosePayrollMonthSetupPage} />
      </Switch>
    </Suspense>
  );
}
