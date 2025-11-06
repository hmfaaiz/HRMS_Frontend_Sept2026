import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { AttendanceViewPage } from "./forms/AttendanceViewPage";

export default function AttendanceSummaryManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/attendance_summary" to="/attendance_summary/read-all-attendance-summary" />}
      
        <ContentRoute path="/attendance_summary/read-all-attendance-summary" component={AttendanceViewPage} />
      </Switch>
    </Suspense>
  );
}
