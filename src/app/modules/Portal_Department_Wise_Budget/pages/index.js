import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./portal_department_wise_budget/FormPage";

export default function HolidaysManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>

      <Switch>
        {<Redirect exact={true} from="/portal_department_wise_budget" to="/portal_department_wise_budget/read-all-portal-department-wise-budget" />}
        <ContentRoute path="/portal_department_wise_budget/read-all-portal-department-wise-budget" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
