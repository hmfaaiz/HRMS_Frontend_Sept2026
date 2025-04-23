import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { LeaveRequestPage } from "./forms/LeaveApplicationPage";

export default function LeaveRequestManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/leave-request"
            to="/leave-request/read-all-leave-request"
          />
        }
        <ContentRoute
          path="/leave-request/read-all-leave-request"
          component={LeaveRequestPage}
        />
      </Switch>
    </Suspense>
  );
}
