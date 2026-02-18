import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./project_timeline/FormPage";

export default function ProjectTimeLinePortalManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/project_timeline_portal"
            to="/project_timeline_portal/read-all-project-timeline"
          />
        }
        <ContentRoute
          path="/project_timeline_portal/read-all-project-timeline"
          component={FormPage}
        />
      </Switch>
    </Suspense>
  );
}
