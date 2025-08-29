import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { RoundingPolicyPage } from "./forms/RoundingPolicyPage";

export default function RoundingPolicyManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/salary_rounding_policy" to="/salary_rounding_policy/read-all-rounding-policy" />}
        <ContentRoute path="/salary_rounding_policy/read-all-rounding-policy" component={RoundingPolicyPage} />
      </Switch>
    </Suspense>
  );
}
