import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./emailConfig/FormPage";

export default function EmailConfigurationManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/email_configuration"
            to="/email_configuration/read-all-email-config"
          />
        }
        <ContentRoute
          path="/email_configuration/read-all-email-config"
          component={FormPage}
        />
      </Switch>
    </Suspense>
  );
}
