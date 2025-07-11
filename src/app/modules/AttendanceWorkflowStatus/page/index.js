import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
import { AttendanceWorkflowStatusPage } from "./AttendanceWorkflowStatusPage";

export default function AttendanceApprovalManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/attendance-workflow-status"
            to="/attendance-workflow-status/read-all-attendance-workflow-status"
          />
        }
        <ContentRoute
          path="/attendance-workflow-status/read-all-attendance-workflow-status"
          component={AttendanceWorkflowStatusPage}
        />
      </Switch>
    </Suspense>
  );
}
