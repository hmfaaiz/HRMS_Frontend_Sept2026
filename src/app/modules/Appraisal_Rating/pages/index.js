import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./Appraisal_rating/FormPage";

export default function AppraisalRatttingManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/appraisal_rating"
            to="/appraisal_rating/read-all-appraisal-rating"
          />
        }
        <ContentRoute
          path="/appraisal_rating/read-all-appraisal-rating"
          component={FormPage}
        />
      </Switch>
    </Suspense>
  );
}
