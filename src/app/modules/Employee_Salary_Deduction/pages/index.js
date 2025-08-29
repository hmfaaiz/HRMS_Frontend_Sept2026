import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { EmployeeSalaryDeductionPage } from "./banks/BanksPage";

export default function EmployeeSalaryDeductionPageManagement() {
  console.log('EmployeeSalaryDeductionPage salary mein aya')
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/employee_salary_deduction" to="/employee_salary_deduction/read-all-employee-salary-deduction" />}
        <ContentRoute path="/employee_salary_deduction/read-all-employee-salary-deduction" component={EmployeeSalaryDeductionPage} />
      </Switch>
    </Suspense>
  );
}
