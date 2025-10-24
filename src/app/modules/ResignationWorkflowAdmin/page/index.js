import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
import { ResignationWorkflowStatusPage } from "./ResignationWorkflowStatusPage";

export default function ResignationWorkflowManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/resignation_workflow"
            to="/resignation_workflow/read-all-resignation-workflow-status"
          />
        }
        <ContentRoute
          path="/resignation_workflow/read-all-resignation-workflow-status"
          component={ResignationWorkflowStatusPage}
        />
      </Switch>
    </Suspense>
  );
}
