import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { EmployeeTaskPage } from "../pages/employee_task/FormPage";

export default function EmployeeTaskPortal() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact={true}
          from="/employee_task"
          to="/employee_task/read-all-employee-task"
        />
        <ContentRoute
          path="/employee_task/read-all-employee-task"
          component={EmployeeTaskPage}
        />
      </Switch>
    </Suspense>
  );
}
