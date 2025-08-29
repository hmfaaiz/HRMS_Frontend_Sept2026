import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./calendar/FormPage";

export default function LeaveCalendarManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>

      <Switch>
        {<Redirect exact={true} from="/leave_calendar" to="/leave_calendar/read-leave-calendar" />}
        <ContentRoute path="/leave_calendar/read-leave-calendar" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
