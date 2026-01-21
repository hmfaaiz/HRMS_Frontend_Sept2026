import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./form/FormPage";
export default function AppraisalStatusManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/appraisal_status"
            to="/appraisal_status/read-all-appraisal-status"
          />
        }
        <ContentRoute
          path="/appraisal_status/read-all-appraisal-status"
          component={FormPage}
        />
      </Switch>
    </Suspense>
  );
}
