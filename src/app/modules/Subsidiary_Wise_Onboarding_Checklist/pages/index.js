import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./subsidiary_wise_onboarding_checklist/FormPage";

export default function subsidiary_wise_onboarding_checklist() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/onboarding_checklist" to="/onboarding_checklist/read-all-onboarding-checklist" />}
        <ContentRoute path="/onboarding_checklist/read-all-onboarding-checklist" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
