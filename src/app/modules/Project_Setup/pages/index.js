import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./project_setup/FormPage";

export default function ProjectManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/project_setup"
            to="/project_setup/read-all-project-setup"
          />
        }
        <ContentRoute
          path="/project_setup/read-all-project-setup"
          component={FormPage}
        />
      </Switch>
    </Suspense>
  );
}
