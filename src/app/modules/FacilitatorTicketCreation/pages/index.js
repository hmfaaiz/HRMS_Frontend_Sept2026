import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./facilitatorTicketCreation/FormPage";

export default function EmployeeDocManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
    

      <Switch>
        {<Redirect exact={true} from="/facilitator_ticket_creation" to="/facilitator_ticket_creation/read-all-facilitator-ticket-creation" />}
        <ContentRoute path="/facilitator_ticket_creation/read-all-facilitator-ticket-creation" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
