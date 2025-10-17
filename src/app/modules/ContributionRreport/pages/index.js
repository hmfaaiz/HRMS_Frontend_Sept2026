import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { ContributionReportPage } from "./forms/ContributionReportPage";

export default function LeaveRegisterManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/contribution_report" to="/leave_register/read-contribution-reports" />}
        <ContentRoute path="/contribution_report/read-contribution-reports" component={ContributionReportPage} />
      </Switch>
    </Suspense>
  );
}
