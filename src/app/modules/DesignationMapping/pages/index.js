import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./designation_mapping/FormPage";

export default function DesignationMappingManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/designation_mapping"
            to="/designation_mapping/read-all-designation-mapping"
          />
        }
        <ContentRoute
          path="/designation_mapping/read-all-designation-mapping"
          component={FormPage}
        />
      </Switch>
    </Suspense>
  );
}
