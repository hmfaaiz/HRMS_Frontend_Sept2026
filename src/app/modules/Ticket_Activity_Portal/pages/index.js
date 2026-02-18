import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./form_setup/FormPage";

export default function TicketActivityPortalManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/ticket_activity_portal"
            to="/ticket_activity_portal/read-ticket-activity"
          />
        }
        <ContentRoute
          path="/ticket_activity_portal/read-ticket-activity"
          component={FormPage}
        />
      </Switch>
    </Suspense>
  );
}
