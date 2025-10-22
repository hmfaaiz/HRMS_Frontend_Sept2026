import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./Separate_Exit_Clearance/FormPage";

export default function ExitClearanceManagement() {

 
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/exit_clearance" to="/exit_clearance/read-all-exit-clearance" />}
        <ContentRoute path="/exit_clearance/read-all-exit-clearance" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
