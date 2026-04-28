import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./post_approval_travel_request/FormPage";

export default function PostApprovalTravelRequestManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact
          from="/post_approval_travel_request"
          to="/post_approval_travel_request/read-all-post-approval-travel-request"
        />
        <ContentRoute
          path="/post_approval_travel_request/read-all-post-approval-travel-request"
          component={FormPage}
        />
      </Switch>
    </Suspense>
  );
}