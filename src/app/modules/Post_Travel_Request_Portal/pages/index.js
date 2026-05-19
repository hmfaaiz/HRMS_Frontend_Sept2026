import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./post_travel_request_portal/FormPage";

export default function PostTravelRequestPortalManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact
          from="/post_travel_request"
          to="/post_travel_request/read-all-post-travel-request"
        />
        <ContentRoute
          path="/post_travel_request/read-all-post-travel-request"
          component={FormPage}
        />
      </Switch>
    </Suspense>
  );
}