import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./form/FormPage";

export default function DashboardAlertConfiguration() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/configuration"
            to="/configuration/read-dashboard-alert"
          />
        }
        <ContentRoute
          path="/configuration/read-dashboard-alert"
          component={FormPage}
        />
      </Switch>
    </Suspense>
  );
}
