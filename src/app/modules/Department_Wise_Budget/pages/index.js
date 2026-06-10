import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./department_wise_budget/FormPage";

export default function DepartmentWiseBudgetManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>

      <Switch>
        {<Redirect exact={true} from="/department_wise_budget" to="/department_wise_budget/read-all-department-wise-budget" />}
        <ContentRoute path="/department_wise_budget/read-all-department-wise-budget" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
