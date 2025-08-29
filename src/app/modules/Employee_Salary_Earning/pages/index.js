import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { EmployeeSalaryPage } from "./banks/BanksPage";

export default function EmployeeSalaryManagement() {
  console.log('employee salary mein aya')
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/employee_salary_earning" to="/employee_salary_earning/read-all-employee-salary-earning" />}
        <ContentRoute path="/employee_salary_earning/read-all-employee-salary-earning" component={EmployeeSalaryPage} />
      </Switch>
    </Suspense>
  );
}
