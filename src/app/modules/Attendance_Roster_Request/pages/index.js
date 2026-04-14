import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./attendance_roster_request/FormPage";

export default function ReimbursementClaim() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact={true}
          from="/attendance_roster_request"
          to="/attendance_roster_request/read-all-attendance-roster-request"
        />
        <ContentRoute
          path="/attendance_roster_request/read-all-attendance-roster-request"
          component={FormPage}
        />
      </Switch>
    </Suspense>
  );
}