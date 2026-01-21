import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./facilitator_Ownership/FormPage";

export default function EmployeeDocManagement() {
console.log("LayoutSplashScreen1112")
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
    

      <Switch>
        {<Redirect exact={true} from="/facilitator_ownership" to="/facilitator_ownership/read-all-facilitator-ownership" />}
        <ContentRoute path="/facilitator_ownership/read-all-facilitator-ownership" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
