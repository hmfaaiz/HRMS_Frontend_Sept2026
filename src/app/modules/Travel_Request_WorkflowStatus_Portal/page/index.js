import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { TravelRequestWorkflowStatusPage } from "./TravelRequestWorkflowStatusPage";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";

export default function TravelRequestWorkflowStatusPortal() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/travel_request_workflow_status"
            to="/travel_request_workflow_status/read-all-travel-request-workflow-status"
          />
        }
        <ContentRoute
          path="/travel_request_workflow_status/read-all-travel-request-workflow-status"
          component={TravelRequestWorkflowStatusPage}
        />
      </Switch>
    </Suspense>
  );
}
