import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./travel_request/FormPage";

export default function TravelRequestManagement() {
  return (
    <>
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/travel_request" to="/travel_request/read-all-travel-request" />}
        <ContentRoute path="/travel_request/read-all-travel-request" component={FormPage} />
      </Switch>
    </Suspense></>
  );
}

