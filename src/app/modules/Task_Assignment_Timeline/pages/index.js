import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./task_assignment_timeline/FormPage";

export default function ProjectManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/task_assignment_timeline"
            to="/task_assignment_timeline/read-all-task-assignment-timeline"
          />
        }
        <ContentRoute
          path="/task_assignment_timeline/read-all-task-assignment-timeline"
          component={FormPage}
        />
      </Switch>
    </Suspense>
  );
}
