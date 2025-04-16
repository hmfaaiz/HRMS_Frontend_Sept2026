import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { PayrollRegisterPage } from "./forms/PayrollRegisterPage";
import { PayrollRegisterPreviewPage } from "./preview/previewRegisterPDF";

export default function PayrollRegisterManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/payroll_register" to="/payroll_register/read-all-registered-payroll" />}
        <ContentRoute path="/payroll_register/read-all-registered-payroll" component={PayrollRegisterPage} />

        {<Redirect exact={true} from="/payroll_register" to="/payroll_register/preview-registered-payroll-pdf" />}
        <ContentRoute path="/payroll_register/preview-registered-payroll-pdf" component={PayrollRegisterPreviewPage} />
      </Switch>
    </Suspense>
  );
}
