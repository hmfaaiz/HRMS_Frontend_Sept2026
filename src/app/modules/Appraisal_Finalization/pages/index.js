import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./form/FormPage";
export default function AppraisalFinalizationManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/appraisal_finalization"
            to="/appraisal_finalization/read-all-appraisal-finalization"
          />
        }
        <ContentRoute
          path="/appraisal_finalization/read-all-appraisal-finalization"
          component={FormPage}
        />
      </Switch>
    </Suspense>
  );
}
