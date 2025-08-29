import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { LeaveApplicationPage } from "./forms/LeaveApplicationPage";

export default function LeaveApplicationManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/leave_application" to="/leave_application/read-all-leave-application" />}
        <ContentRoute path="/leave_application/read-all-leave-application" component={LeaveApplicationPage} />
      </Switch>
    </Suspense>
  );
}
