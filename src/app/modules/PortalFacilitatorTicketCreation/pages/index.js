import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./facilitatorTicketCreation/FormPage";

export default function PortalTicketManagementManagement() {
console.log("hdsahsdhdshsd")
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
    

      <Switch>
        {<Redirect exact={true} from="/portal_ticket_creation" to="/portal_ticket_creation/read-all-facilitator-ticket-creation" />}
        <ContentRoute path="/portal_ticket_creation/read-all-facilitator-ticket-creation" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
