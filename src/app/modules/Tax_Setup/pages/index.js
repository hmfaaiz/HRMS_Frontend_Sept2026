import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { TaxSetupPage } from "./forms/TaxSetupPage";

export default function TaxSetupManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/tax_setup" to="/tax_setup/read-all-tax-setup" />}
        <ContentRoute path="/tax_setup/read-all-tax-setup" component={TaxSetupPage} />
      </Switch>
    </Suspense>
  );
}
