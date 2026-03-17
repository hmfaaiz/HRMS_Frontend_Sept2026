import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./form_setup/FormPage";

export default function FormManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/customer_config"
            to="/customer_config/read-all-customer-config"
          />
        }
        <ContentRoute
          path="/customer_config/read-all-customer-config"
          component={FormPage}
        />
      </Switch>
    </Suspense>
  );
}
