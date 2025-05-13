import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { AttendanceApprovalPage } from "./AttendanceApprovalPage";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";

export default function AttendanceApprovalManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/attendance_approval"
            to="/attendance_approval/read-all-attendance-approval"
          />
        }
        <ContentRoute
          path="/attendance_approval/read-all-attendance-approval"
          component={AttendanceApprovalPage}
        />
      </Switch>
    </Suspense>
  );
}
