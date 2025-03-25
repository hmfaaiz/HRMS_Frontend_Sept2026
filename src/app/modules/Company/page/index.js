import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
import { CompanyPage } from "./CompanyPage";

export default function CompanyManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/company"
            to="/company/read-all-company"
          />
        }
        <ContentRoute
          path="/company/read-all-company"
          component={CompanyPage}
        />
      </Switch>
    </Suspense>
  );
}
