import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./form/FormPage";
export default function AppraisalReviewManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/appraisal_review"
            to="/appraisal_review/read-all-appraisal-review"
          />
        }
        <ContentRoute
          path="/appraisal_review/read-all-appraisal-review"
          component={FormPage}
        />
      </Switch>
    </Suspense>
  );
}
