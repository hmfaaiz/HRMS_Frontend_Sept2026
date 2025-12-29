import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { AttendancePage } from "./forms/AttendancePage";
import { AttendanceViewPage } from "./forms/AttendanceViewPage";

export default function AttendanceManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/attendance_correction" to="/attendance_correction/read-all-attendance-correction" />}

        <ContentRoute path="/attendance_correction/read-all-attendance-correction" component={AttendanceViewPage} />
      </Switch>
    </Suspense>
  );
}
