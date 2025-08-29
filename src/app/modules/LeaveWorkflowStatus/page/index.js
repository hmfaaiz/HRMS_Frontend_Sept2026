import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LeaveWorkflowStatusPage } from "./LeaveWorkflowStatusPage";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";

export default function LeaveWorkflowStatus() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/leave-workflow-status"
            to="/leave-workflow-status/read-all-leave-workflow-status"
          />
        }
        <ContentRoute
          path="/leave-workflow-status/read-all-leave-workflow-status"
          component={LeaveWorkflowStatusPage}
        />
      </Switch>
    </Suspense>
  );
}
