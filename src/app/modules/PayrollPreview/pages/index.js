import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { PayrollRegisterPage } from "./forms/PayrollRegisterPage";
import PreviewPayslipPDF from "./preview/previewPayslipPDF";

export default function PayrollPreviewManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/payslip" to="/payslip/read-payslip" />}
        <ContentRoute path="/payslip/read-payslip" component={PayrollRegisterPage} />



        {<Redirect exact={true} from="/payslip" to="/payslip/preview-payslip-pdf" />}
        <ContentRoute path="/payslip/preview-payslip-pdf" component={PreviewPayslipPDF} />
      </Switch>
    </Suspense>
  );
}
