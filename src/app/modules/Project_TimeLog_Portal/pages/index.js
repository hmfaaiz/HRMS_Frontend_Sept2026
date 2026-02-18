import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./ticket_setup/FormPage";

export default function TimeLoggingPortalManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/time_logging_portal"
            to="/time_logging_portal/read-all-time-log"
          />
        }
        <ContentRoute
          path="/time_logging_portal/read-all-time-log"
          component={FormPage}
        />
      </Switch>
    </Suspense>
  );
}
