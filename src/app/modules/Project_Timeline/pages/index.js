import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./project_timeline/FormPage";

export default function ProjectManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/project_timeline"
            to="/project_timeline/read-all-project-timeline"
          />
        }
        <ContentRoute
          path="/project_timeline/read-all-project-timeline"
          component={FormPage}
        />
      </Switch>
    </Suspense>
  );
}
