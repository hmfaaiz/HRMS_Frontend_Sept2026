import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./EmployeeGoalSetupPortal/FormPage";

export default function EmployeeGoalSetupPortalManagement() {

 
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/employee_goal_setup_portal" to="/employee_goal_setup_portal/read-all-employee-goal-setup" />}
        <ContentRoute path="/employee_goal_setup_portal/read-all-employee-goal-setup" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
