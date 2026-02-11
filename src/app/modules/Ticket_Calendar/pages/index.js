import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./calendar/FormPage";

export default function TicketCalendarManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>

      <Switch>
        {<Redirect exact={true} from="/ticket_calendar" to="/ticket_calendar/read-ticket-calendar" />}
        <ContentRoute path="/ticket_calendar/read-ticket-calendar" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
