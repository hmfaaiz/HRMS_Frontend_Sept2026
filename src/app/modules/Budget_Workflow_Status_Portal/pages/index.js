import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
import { BudgetWorkflowPortalPage } from "./budget_workflow_status_portal/FormPage";

export default function BudgetWorkflowPortalManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact
          from="/budget_workflow_status_portal"
          to="/budget_workflow_status_portal/read-all-budget-workflow-status-portal"
        />
        <ContentRoute
          path="/budget_workflow_status_portal/read-all-budget-workflow-status-portal"
          component={BudgetWorkflowPortalPage}
        />
      </Switch>
    </Suspense>
  );
}