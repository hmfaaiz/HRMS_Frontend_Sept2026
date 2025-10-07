import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./Appraisal_Config/FormPage";

export default function AppraisalConfiguration() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/appraisal_configuration"
            to="/appraisal_configuration/read-all-appraisal-configuration"
          />
        }
        <ContentRoute
          path="/appraisal_configuration/read-all-appraisal-configuration"
          component={FormPage}
        />
      </Switch>
    </Suspense>
  );
}
