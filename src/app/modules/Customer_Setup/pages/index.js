import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./customer_setup/FormPage";

export default function BranchManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/customer_setup" to="/customer_setup/read-all-customer-setup" />}
        <ContentRoute path="/customer_setup/read-all-customer-setup" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
