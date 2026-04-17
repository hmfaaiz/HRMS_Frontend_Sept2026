import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
import { RosterWorkflowHrmsPage } from "./attendance_roster_workflow/RosterWorkflowPage";

export default function ReimbursementWorkflowHrmsManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact
          from="/attendance_roster_workflow_status"
          to="/attendance_roster_workflow_status/read-all-attendance-roster-workflow-status"
        />
        <ContentRoute
          path="/attendance_roster_workflow_status/read-all-attendance-roster-workflow-status"
          component={RosterWorkflowHrmsPage}
        />
      </Switch>
    </Suspense>
  );
}