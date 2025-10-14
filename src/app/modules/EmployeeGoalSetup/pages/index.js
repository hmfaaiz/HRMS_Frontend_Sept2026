import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./EmployeeGoalSetup/FormPage";

export default function EmployeeGoalSetupManagement() {

 
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/employee_goal_setup" to="/employee_goal_setup/read-all-employee-goal-setup" />}
        <ContentRoute path="/employee_goal_setup/read-all-employee-goal-setup" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
