import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
import { BudgetWorkflowHrmsPage } from "./budget_workflow_status/FormPage";

export default function BudgetWorkflowManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact
          from="/budget_workflow_status"
          to="/budget_workflow_status/read-all-budget-workflow-status"
        />
        <ContentRoute
          path="/budget_workflow_status/read-all-budget-workflow-status"
          component={BudgetWorkflowHrmsPage}
        />
      </Switch>
    </Suspense>
  );
}