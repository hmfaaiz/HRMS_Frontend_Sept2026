import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { ContributionReportPage } from "./forms/ContributionReportPage";

export default function IncomeTaxReportrManagement() {
  console.log("IncomeTaxReportrManagement11111")
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/income_tax_report" to="/income_tax_report/read-all-income-tax-report" />}
        <ContentRoute path="/income_tax_report/read-all-income-tax-report" component={ContributionReportPage} />
      </Switch>
    </Suspense>
  );
}
