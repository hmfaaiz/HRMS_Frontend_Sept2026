import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { EmployeeRosterPage } from "./forms/EmployeeRosterPage";

export default function EmployeeRosterManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/employee_roster" to="/employee_roster/read-all-employee-roster" />}
        <ContentRoute path="/employee_roster/read-all-employee-roster" component={EmployeeRosterPage} />
      </Switch>
    </Suspense>
  );
}
