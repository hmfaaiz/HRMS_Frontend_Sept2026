import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./form_setup/FormPage";

export default function TicketActivityManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/ticket_activity"
            to="/ticket_activity/read-ticket-activity"
          />
        }
        <ContentRoute
          path="/ticket_activity/read-ticket-activity"
          component={FormPage}
        />
      </Switch>
    </Suspense>
  );
}
