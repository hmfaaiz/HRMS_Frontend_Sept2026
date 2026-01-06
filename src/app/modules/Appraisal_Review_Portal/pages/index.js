import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./form/FormPage";
export default function AppraisalReviewPortalManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/emp_appraisal"
            to="/emp_appraisal/appraisal-review-finalization"
          />
        }
        <ContentRoute
          path="/emp_appraisal/appraisal-review-finalization"
          component={FormPage}
        />
      </Switch>
    </Suspense>
  );
}
