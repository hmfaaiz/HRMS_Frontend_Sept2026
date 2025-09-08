import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LeaveWorkflowStatusPage } from "./LeaveWorkflowStatusPage";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";

export default function LeaveWorkflowAdmin() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/leave_workflow"
            to="/leave_workflow/read-all-leave-workflow-status"
          />
        }
        <ContentRoute
          path="/leave_workflow/read-all-leave-workflow-status"
          component={LeaveWorkflowStatusPage}
        />
      </Switch>
    </Suspense>
  );
}
