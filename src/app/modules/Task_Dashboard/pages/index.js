import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./form-setup/FormPage";

export default function TaskDashboard() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/task_dashboard"
            to="/task_dashboard/read-task-dashboard"
          />
        }
        <ContentRoute
          path="/task_dashboard/read-task-dashboard"
          component={FormPage}
        />
      </Switch>
    </Suspense>
  );
}
