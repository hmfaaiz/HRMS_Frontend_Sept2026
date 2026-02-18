import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./ticket_setup/FormPage";

export default function ProjectManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/ticket_setup_portal"
            to="/ticket_setup_portal/read-all-ticket-setup"
          />
        }
        <ContentRoute
          path="/ticket_setup_portal/read-all-ticket-setup"
          component={FormPage}
        />
      </Switch>
    </Suspense>
  );
}
