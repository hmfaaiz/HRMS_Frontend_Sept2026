import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { EmployeeRegisterPage } from "./forms/EmployeeRegisterPage";

export default function EmployeeRegisterManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/employee_register" to="/employee_register/read-all-registered-employees" />}
        <ContentRoute path="/employee_register/read-all-registered-employees" component={EmployeeRegisterPage} />
      </Switch>
    </Suspense>
  );
}
