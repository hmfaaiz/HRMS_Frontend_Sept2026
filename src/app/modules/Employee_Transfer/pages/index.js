import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { EmployeeTransferPage } from "./banks/BanksPage";

export default function EmployeeTransferManagment() {
  console.log('employee_transfer men aya')
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/employee_transfer" to="/employee_transfer/read-all-employee-transfer" />}
        <ContentRoute path="/employee_transfer/read-all-employee-transfer" component={EmployeeTransferPage} />
      </Switch>
    </Suspense>
  );
}
