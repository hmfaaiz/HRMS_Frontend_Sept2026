import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
import { TravelRequestApprovalPage } from "./travel_request_approval";

export default function TravelRequestApprovalManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/travel_request_approval"
            to="/travel_request_approval/read-all-travel-request-approval"
          />
        }
        <ContentRoute
          path="/travel_request_approval/read-all-travel-request-approval"
          component={TravelRequestApprovalPage}
        />
      </Switch>
    </Suspense>
  );
}
