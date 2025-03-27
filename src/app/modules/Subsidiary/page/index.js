import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
import { SubsidiaryPage } from "./SubsidiaryPage";

export default function SubsidiaryManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/subsidiary"
            to="/subsidiary/read-all-subsidiary"
          />
        }
        <ContentRoute
          path="/subsidiary/read-all-subsidiary"
          component={SubsidiaryPage}
        />
      </Switch>
    </Suspense>
  );
}
