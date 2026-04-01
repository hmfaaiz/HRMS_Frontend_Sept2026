import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./project_sprint/FormPage";

export default function ProjectSprintManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/project_sprint"
            to="/project_sprint/read-all-project-sprint"
          />
        }
        <ContentRoute
          path="/project_sprint/read-all-project-sprint"
          component={FormPage}
        />
      </Switch>
    </Suspense>
  );
}
