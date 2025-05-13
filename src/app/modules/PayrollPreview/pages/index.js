import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { PayrollRegisterPage } from "./forms/PayrollRegisterPage";
import PreviewPayslipPDF from "./preview/previewPayslipPDF";

export default function PayrollPreviewManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/payroll_preview" to="/payroll_preview/read-all-payroll" />}
        <ContentRoute path="/payroll_preview/read-all-payroll" component={PayrollRegisterPage} />



        {<Redirect exact={true} from="/payroll_preview" to="/payroll_preview/preview-payslip-pdf" />}
        <ContentRoute path="/payroll_preview/preview-payslip-pdf" component={PreviewPayslipPDF} />
      </Switch>
    </Suspense>
  );
}
