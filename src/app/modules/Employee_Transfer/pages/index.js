import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "../pages/Employee_Transfer/FormPage";

export default function EmployeeTransferManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>

      <Switch>
        {<Redirect exact={true} from="/employee_transfer" to="/employee_transfer/read-all-employee-transfer" />}
        <ContentRoute path="/employee_transfer/read-all-employee-transfer" component={FormPage} />
      </Switch>
    </Suspense>
  );
}

