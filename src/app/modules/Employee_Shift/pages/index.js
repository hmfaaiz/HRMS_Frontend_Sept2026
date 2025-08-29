import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { EmployeeShiftPage } from "./forms/EmployeeShiftPage";

export default function EmployeeShiftManagement() {

  return (
    
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/employee_shift" to="/employee_shift/read-all-employee-shift" />}
        <ContentRoute path="/employee_shift/read-all-employee-shift" component={EmployeeShiftPage} />
      </Switch>
    </Suspense>
  );
}
