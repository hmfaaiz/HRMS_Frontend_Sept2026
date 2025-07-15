import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./calendar/FormPage";

export default function CalendarManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>

      <Switch>
        {<Redirect exact={true} from="/holiday_calendar" to="/holiday_calendar/my-holiday-calendar" />}
        <ContentRoute path="/holiday_calendar/my-holiday-calendar" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
