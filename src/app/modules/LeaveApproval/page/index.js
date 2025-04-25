import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LeaveApprovalPage } from "./LeaveApprovalPage";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";

export default function LeaveApprovalManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/leave-approval"
            to="/leave-approval/read-all-leave-approval"
          />
        }
        <ContentRoute
          path="/leave-approval/read-all-leave-approval"
          component={LeaveApprovalPage}
        />
      </Switch>
    </Suspense>
  );
}
