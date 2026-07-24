import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./cpl_leave/FormPage";

export default function CPLLeaveManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
    

      <Switch>
        {<Redirect exact={true} from="/cpl_leave" to="/cpl_leave/read-all-cpl-leave" />}
        <ContentRoute path="/cpl_leave/read-all-cpl-leave" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
