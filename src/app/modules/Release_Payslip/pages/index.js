import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./release_payslip_portal/FormPage";

export default function ReleasePayslipManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/release_payslip"
            to="/release_payslip/read-all-finalize-payroll-group"
          />
        }
        <ContentRoute
          path="/release_payslip/read-all-finalize-payroll-group"
          component={FormPage}
        />
      </Switch>
    </Suspense>
  );
}
