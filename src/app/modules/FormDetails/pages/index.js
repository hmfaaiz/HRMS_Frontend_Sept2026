import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormDetailsPage } from "./formdetails/FormDetailsPage";

export default function FormDetailsManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/formdetails" to="/formdetails/read-all-parent-forms" />}
        <ContentRoute path="/formdetails/read-all-parent-forms" component={FormDetailsPage} />
      </Switch>
    </Suspense>
  );
}
