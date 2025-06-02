import React, { Suspense } from "react";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
import { Switch, Redirect } from "react-router-dom";
import { FormPage } from "../page/FormPage";

export default function JobOfferMangement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/job_offer"
            to="/job_offer/read-job-offer"
          />
        }
        <ContentRoute
          path="/job_offer/read-job-offer"
          component={FormPage}
        />
      </Switch>
    </Suspense>
  );
}


