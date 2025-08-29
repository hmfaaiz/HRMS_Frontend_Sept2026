import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { ArrearPolicyPage } from "./forms/ArrearPolicyPage";

export default function ArrearPolicyManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/arrear_policy" to="/arrear_policy/read-all-arrear-policy" />}
        <ContentRoute path="/arrear_policy/read-all-arrear-policy" component={ArrearPolicyPage} />
      </Switch>
    </Suspense>
  );
}
