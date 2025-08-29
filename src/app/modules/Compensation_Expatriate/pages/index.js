import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { CompensationExpPage } from "./banks/BanksPage";

export default function EmployeeSalaryManagement() {
  console.log('CompensationExpPage Page Insert')
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/compensation_expatriate" to="/compensation_expatriate/read-all-compensation-expatriate" />}
        <ContentRoute path="/compensation_expatriate/read-all-compensation-expatriate" component={CompensationExpPage} />
      </Switch>
    </Suspense>
  );
}
