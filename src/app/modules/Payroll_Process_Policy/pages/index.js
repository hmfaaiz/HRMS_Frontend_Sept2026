import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { Payroll_Policy } from "./forms/Payroll_Policy_Page";

export default function PayrollPolicyManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/payroll_process_policy" to="payroll_process_policy/read-all-payroll-process-policy" />}
        <ContentRoute path="/payroll_process_policy/read-all-payroll-process-policy" component={Payroll_Policy} />
      </Switch>
    </Suspense>
  );
}
