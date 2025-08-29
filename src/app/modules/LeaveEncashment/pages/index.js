import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { LeaveEncashmentPage } from "./forms/LeaveEncashmentPage";

export default function LeaveEncashmentManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/leave_encashment" to="/leave_encashment/read-all-leave-encashment" />}
        <ContentRoute path="/leave_encashment/read-all-leave-encashment" component={LeaveEncashmentPage} />
      </Switch>
    </Suspense>
  );
}
