import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./calendar/FormPage";

export default function RosterCalendarManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>

      <Switch>
        {<Redirect exact={true} from="/roster_calendar" to="/roster_calendar/read-roster-calendar" />}
        <ContentRoute path="/roster_calendar/read-roster-calendar" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
