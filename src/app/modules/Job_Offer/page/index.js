import React, { Suspense } from "react";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
import { Switch, Redirect } from "react-router-dom";
import { FormPage } from "../page/FormPage";
import JobOfferPreview from "./preview/JobOfferPreview";

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


        {<Redirect exact={true} from="/job_offer" to="/payroll_register/read-job-offer-preview" />}
        <ContentRoute path="/job_offer/read-job-offer-preview" component={JobOfferPreview} />
        <ContentRoute
          path="/job_offer/read-job-offer"
          component={FormPage}
        />
      </Switch>
    </Suspense>
  );
}


