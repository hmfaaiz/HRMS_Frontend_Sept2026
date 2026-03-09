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
            from="/customer_user"
            to="/customer_user/read-all-customer-user"
          />
        }
        <ContentRoute
          path="/customer_user/read-all-customer-user"
          component={FormPage}
        />
      </Switch>
    </Suspense>
  );
}
