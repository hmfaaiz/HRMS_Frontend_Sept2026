import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../_metronic/layout";
import { FormPage } from "./page/FormPage";

export default function HODManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/hod_setup"
            to="/hod_setup/read-all-hod-setup"
          />
        }
        <ContentRoute
          path="/hod_setup/read-all-hod-setup"
          component={FormPage}
        />
      </Switch>
    </Suspense>
  );
}
