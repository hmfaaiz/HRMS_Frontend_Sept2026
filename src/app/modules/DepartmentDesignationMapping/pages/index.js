import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./department_designation_mapping/FormPage";

export default function DesignationMappingManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/department_designation_map"
            to="/department_designation_map/read-all-department-designation-map"
          />
        }
        <ContentRoute
          path="/department_designation_map/read-all-department-designation-map"
          component={FormPage}
        />
      </Switch>
    </Suspense>
  );
}
