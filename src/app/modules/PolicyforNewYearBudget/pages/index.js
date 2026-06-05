import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./policyforNewYearBudget/FormPage";

export default function HolidaysManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>

      <Switch>
        {<Redirect exact={true} from="/policy_for_new_year_budget" to="/policy_for_new_year_budget/read-all-policy-for-new-year-budget" />}
        <ContentRoute path="/policy_for_new_year_budget/read-all-policy-for-new-year-budget" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
