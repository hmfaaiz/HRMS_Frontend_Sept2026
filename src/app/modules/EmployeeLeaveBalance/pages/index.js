import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { EmployeeLeaveBalancePage } from "./forms/EmployeeLeaveBalancePage";

export default function EmployeeLeaveBalanceManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/employee_leave_balance" to="/employee_leave_balance/read-all-employee-leave-balance" />}
        <ContentRoute path="/employee_leave_balance/read-all-employee-leave-balance" component={EmployeeLeaveBalancePage} />
      </Switch>
    </Suspense>
  );
}
