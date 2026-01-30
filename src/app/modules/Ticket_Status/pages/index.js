import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { TicketStatusFormPage } from "./ticket_status/FromPage";

export default function BranchManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/ticket_status" to="/ticket_status/read-all-ticket-status" />}
        <ContentRoute path="/ticket_status/read-all-ticket-status" component={TicketStatusFormPage} />
      </Switch>
    </Suspense>
  );
}
