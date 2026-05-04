import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./roster_calendar_portal/FormPage";

export default function PortalRosterCalendarManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
    
<Redirect
  exact={true}
  from="/roster_calendar_team"
  to="/roster_calendar_team/read-roster-calendar"
/>
<ContentRoute
  path="/roster_calendar_team/read-roster-calendar" 
  component={FormPage}
/>
      </Switch>
    </Suspense>
  );
}