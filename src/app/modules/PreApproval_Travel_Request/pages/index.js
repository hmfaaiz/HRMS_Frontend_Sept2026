import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./preapproval_travel_request/FormPage";

export default function Tada_configurationManagement() {
  return (
    <>
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/preapproval_travel_request" to="/preapproval_travel_request/read-all-preapproval_travel_request" />}
        <ContentRoute path="/preapproval_travel_request/read-all-preapproval_travel_request" component={FormPage} />
      </Switch>
    </Suspense></>
  );
}
