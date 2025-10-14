import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./Appraisal_Publish/FormPage";

export default function AppraisalPublishManagment() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/appraisal_publish"
            to="/appraisal_publish/read-all-appraisal-publish"
          />
        }
        <ContentRoute
          path="/appraisal_publish/read-all-appraisal-publish"
          component={FormPage}
        />
      </Switch>
    </Suspense>
  );
}
