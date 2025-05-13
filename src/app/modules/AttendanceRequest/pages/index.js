import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { AttendanceViewPage } from "./forms/AttendanceViewPage";

export default function AttendanceRequestManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/attendance_request"
            to="/attendance_request/read-all-attendance-request"
          />
        }
        <ContentRoute
          path="/attendance_request/read-all-attendance-request"
          component={AttendanceViewPage}
        />
      </Switch>
    </Suspense>
  );
}
