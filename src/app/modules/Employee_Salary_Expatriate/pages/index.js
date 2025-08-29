import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { EmployeeSalaryExpPage } from "./banks/BanksPage";

export default function EmployeeSalaryManagement() {
  console.log('employee salary expatriate mein aya')
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/salary_expatriate" to="/salary_expatriate/read-all-employee-salary-expatriate" />}
        <ContentRoute path="/salary_expatriate/read-all-employee-salary-expatriate" component={EmployeeSalaryExpPage} />
      </Switch>
    </Suspense>
  );
}
