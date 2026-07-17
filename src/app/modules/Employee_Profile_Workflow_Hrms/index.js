import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../_metronic/layout";
import { FormPage } from "./FormPage";

export default function EmployeeProfileWorkflowHrmsModule() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>

      <Switch>
        {<Redirect exact={true} from="/employee_profile_workflow_hrms" to="/employee_profile_workflow_hrms/read-all-employee-profile-workflow-hrms" />}
        <ContentRoute path="/employee_profile_workflow_hrms/read-all-employee-profile-workflow-hrms" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
