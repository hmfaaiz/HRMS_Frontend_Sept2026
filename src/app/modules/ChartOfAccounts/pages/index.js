import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormDetailsPage } from "./formdetails/FormDetailsPage";

export default function ChartOfAccountsManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/chart_account" to="/chart_account/read-all-chart-of-accounts" />}
        <ContentRoute path="/chart_account/read-all-chart-of-accounts" component={FormDetailsPage} />
      </Switch>
    </Suspense>
  );
}
