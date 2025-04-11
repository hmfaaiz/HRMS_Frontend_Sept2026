import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { WorkflowPolicyPage } from "./page/WorkflowPolicyPage";
import { ContentRoute, LayoutSplashScreen } from "../../../_metronic/layout";

export default function WorkflowPolicyManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/workflow_policy"
            to="/workflow_policy/read-all-workflow-policy"
          />
        }
        <ContentRoute
          path="/workflow_policy/read-all-workflow-policy"
          component={WorkflowPolicyPage}
        />
      </Switch>
    </Suspense>
  );
}
