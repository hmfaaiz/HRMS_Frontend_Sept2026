import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
import { JobRequestionWorkflowStatusPage } from "./JobRequestionWorkflowStatusPage";

export default function JobRequestionWorkflowManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/job_requestion_workflow_approval"
            to="/job_requestion_workflow_approval/read-all-job-requestion-workflow-approval"
          />
        }
        <ContentRoute
          path="/job_requestion_workflow_approval/read-all-job-requestion-workflow-approval"
          component={JobRequestionWorkflowStatusPage}
        />
      </Switch>
    </Suspense>
  );
}
