import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./calendar/FormPage";

export default function CalendarManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>

      <Switch>
        {<Redirect exact={true} from="/calendar" to="/calendar/read-holiday" />}
        <ContentRoute path="/calendar/read-holiday" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
