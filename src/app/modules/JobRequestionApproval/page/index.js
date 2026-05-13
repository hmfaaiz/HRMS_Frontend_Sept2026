import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
import { JobRequestionApprovalPage } from "./JobRequestionApprovalPage";
export default function JobRequestionApprovalManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/job_requestion_approval"
            to="/job_requestion_approval/read-all-job-requestion-approval"
          />
        }
        <ContentRoute
          path="/job_requestion_approval/read-all-job-requestion-approval"
          component={JobRequestionApprovalPage}
        />
      </Switch>
    </Suspense>
  );
}
