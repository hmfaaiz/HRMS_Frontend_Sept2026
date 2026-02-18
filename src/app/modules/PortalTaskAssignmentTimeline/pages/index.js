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
            from="/portal_task_assignment_timeline"
            to="/portal_task_assignment_timeline/read-all-task-assignment-timeline"
          />
        }
        <ContentRoute
          path="/portal_task_assignment_timeline/read-all-task-assignment-timeline"
          component={FormPage}
        />
      </Switch>
    </Suspense>
  );
}
