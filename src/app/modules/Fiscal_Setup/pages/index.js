import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FiscalSetupPage } from "./forms/TaxSetupPage";

export default function FiscalSetupManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/fiscal_setup" to="/fiscal_setup/read-all-fiscal-setup" />}
        <ContentRoute path="/fiscal_setup/read-all-fiscal-setup" component={FiscalSetupPage} />
      </Switch>
    </Suspense>
  );
}
