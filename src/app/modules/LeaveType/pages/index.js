import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { LeaveTypePage } from "./forms/LeaveTypePage";

export default function LeaveTypeManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/leave_type" to="/leave_type/read-all-leave-type" />}
        <ContentRoute path="/leave_type/read-all-leave-type" component={LeaveTypePage} />
      </Switch>
    </Suspense>
  );
}
