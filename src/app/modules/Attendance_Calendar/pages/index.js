import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./calendar/FormPage";

export default function AttendanceCalendarManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>

      <Switch>
        {<Redirect exact={true} from="/attendance_calendar" to="/attendance_calendar/read-attendance-calendar" />}
        <ContentRoute path="/attendance_calendar/read-attendance-calendar" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
