import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import {TravelRequestReportsPage} from "./forms/TravelRequestReportsPage"

export default function TravelRequestReportsManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/travel_request_reports" to="/travel_request_reports/read-travel-request-reports" />}
        <ContentRoute path="/travel_request_reports/read-travel-request-reports" component={TravelRequestReportsPage} />
      </Switch>
    </Suspense>
  );
}
