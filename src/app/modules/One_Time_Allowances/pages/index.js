import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./form/FormPage";
export default function OneTimeAllowanceManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/onetime_allowance"
            to="/onetime_allowance/read-all-onetime-allowance"
          />
        }
        <ContentRoute
          path="/onetime_allowance/read-all-onetime-allowance"
          component={FormPage}
        />
      </Switch>
    </Suspense>
  );
}
