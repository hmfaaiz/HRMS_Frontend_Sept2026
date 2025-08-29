import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./form/FormPage";

export default function ApplicantProfileManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>

      <Switch>
        {<Redirect exact={true} from="/applicant_profile" to="/applicant_profile/read-all-applicant-profile" />}
        <ContentRoute path="/applicant_profile/read-all-applicant-profile" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
