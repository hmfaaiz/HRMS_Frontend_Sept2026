import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../_metronic/layout";
import { FormPage } from "./FormPage";

export default function EmployeeProfileWorkflowPortalModule() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>

      <Switch>
        {<Redirect exact={true} from="/employee_profile_workflow" to="/employee_profile_workflow/read-all-employee-profile-workflow" />}
        <ContentRoute path="/employee_profile_workflow/read-all-employee-profile-workflow" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
