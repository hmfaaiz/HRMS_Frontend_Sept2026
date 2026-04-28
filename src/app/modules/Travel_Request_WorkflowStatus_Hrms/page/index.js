import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { TravelRequestWorkflowStatusPage } from "./TravelRequestWorkflowStatusPage";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";

export default function TravelRequestWorkflowStatusPageHrms() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/travel_request_workflow_status_approval"
            to="/travel_request_workflow_status_approval/read-all-travel-request-workflow-status-approval"
          />
        }
        <ContentRoute
          path="/travel_request_workflow_status_approval/read-all-travel-request-workflow-status-approval"
          component={TravelRequestWorkflowStatusPage}
        />
      </Switch>
    </Suspense>
  );
}
