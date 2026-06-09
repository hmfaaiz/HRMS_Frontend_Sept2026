import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { BudgetYearSetupPage } from "./forms/BudgetYearSetupPage";

export default function BudgetYearSetupManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/budget_setup_year" to="/budget_setup_year/read-all-budget-setup" />}
        <ContentRoute path="/budget_setup_year/read-all-budget-setup" component={BudgetYearSetupPage} />
      </Switch>
    </Suspense>
  );
}
