import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { ReportPage } from "./forms/ReportPage"

export default function IncomeTaxReportrManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/portal_ticket_time_report" to="/portal_ticket_time_report/read-all-project-report" />}
        <ContentRoute path="/portal_ticket_time_report/read-all-project-report" component={ReportPage} />
      </Switch>
    </Suspense>
  );
}
