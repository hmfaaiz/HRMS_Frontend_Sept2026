import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
import { JobRequestionWorkflowStatusPage } from "./FormPage";


export default function JobRequestionWorkflowStatus() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact={true}
          from="/job_requestion_workflow"
          to="/job_requestion_workflow/read-all-job-requestion-workflow"
        />
        <ContentRoute
          path="/job_requestion_workflow/read-all-job-requestion-workflow"
          component={JobRequestionWorkflowStatusPage}
        />
      </Switch>
    </Suspense>
  );
}