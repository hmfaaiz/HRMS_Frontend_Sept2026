import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./Task_Group_Report/FormPage";

export default function ProjectManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/task_group_report"
            to="/task_group_report/read-all-task-group-report"
          />
        }
        <ContentRoute
          path="/task_group_report/read-all-task-group-report"
          component={FormPage}
        />
      </Switch>
    </Suspense>
  );
}
