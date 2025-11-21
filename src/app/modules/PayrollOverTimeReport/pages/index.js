import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { ContributionReportPage } from "./forms/ContributionReportPage";

export default function IncomeTaxReportrManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/overtime_report" to="/overtime_report/read-all-overtime-report" />}
        <ContentRoute path="/overtime_report/read-all-overtime-report" component={ContributionReportPage} />
      </Switch>
    </Suspense>
  );
}
