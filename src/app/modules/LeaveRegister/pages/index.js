import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { LeaveRegisterPage } from "./forms/LeaveRegisterPage";

export default function LeaveRegisterManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/leave_register" to="/leave_register/read-all-registered-leaves" />}
        <ContentRoute path="/leave_register/read-all-registered-leaves" component={LeaveRegisterPage} />
      </Switch>
    </Suspense>
  );
}
