import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./aiApiConfig/FormPage";

export default function Ai_Api_ConfigurationManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/ai_api_configuration"
            to="/ai_api_configuration/read-all-ai-api-configuration"
          />
        }
        <ContentRoute
          path="/ai_api_configuration/read-all-ai-api-configuration"
          component={FormPage}
        />
      </Switch>
    </Suspense>
  );
}
