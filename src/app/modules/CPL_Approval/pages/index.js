import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { AttendancePage } from "./forms/AttendancePage";
import { AttendanceViewPage } from "./forms/AttendanceViewPage";

export default function AttendanceManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/cpl_approval" to="/attendance/create-attendance" />}
        <ContentRoute path="/attendance/create-attendance" component={AttendancePage} />
        <ContentRoute path="/cpl_approval/read-all-cpl-Approval" component={AttendanceViewPage} />
      </Switch>
    </Suspense>
  );
}
