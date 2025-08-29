import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { EmpPolicyPage } from "./employeepolicy/EmployeePolicyPage";
 //import { ReligionPage } from "./Religion/ReligionPage";

export default function EmployeePolicyManagement() {
  console.log('emp policy mein aya')
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/policy" to="/policy/read-all-policy" />}
        <ContentRoute path="/policy/read-all-policy" component={EmpPolicyPage} />
      </Switch>
    </Suspense>
  );
}
