import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./form/FormPage";

export default function GeoLocationManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/geo_location"
            to="/geo_location/read-all-geo-location"
          />
        }
        <ContentRoute
          path="/geo_location/read-all-geo-location"
          component={FormPage}
        />
      </Switch>
    </Suspense>
  );
}
