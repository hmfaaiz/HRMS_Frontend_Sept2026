import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./manpower_budget_dashboard/FormCard";

export default function ManpowerBudgetDashboard() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/manpower_budget_dashboard"
            to="/manpower_budget_dashboard/read-manpower-budget-dashboard"
          />
        }
        <ContentRoute
          path="/manpower_budget_dashboard/read-manpower-budget-dashboard"
          component={FormPage}
        />
      </Switch>
    </Suspense>
  );
}
