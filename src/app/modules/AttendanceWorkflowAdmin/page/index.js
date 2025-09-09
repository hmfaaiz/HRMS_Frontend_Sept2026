import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
import { AttendanceWorkflowStatusPage } from "./AttendanceWorkflowStatusPage";

export default function AttendanceWorkflowManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/attendance_workflow"
            to="/attendance_workflow/read-all-attendance-workflow-status"
          />
        }
        <ContentRoute
          path="/attendance_workflow/read-all-attendance-workflow-status"
          component={AttendanceWorkflowStatusPage}
        />
      </Switch>
    </Suspense>
  );
}
