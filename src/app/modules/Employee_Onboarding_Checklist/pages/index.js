import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./employee_onboarding_checklist/FormPage";

export default function OnboardingChecklistManagement() {

 
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/employee_onboarding_checklist" to="/employee_onboarding_checklist/read-all-employee-onboarding-checklist" />}
        <ContentRoute path="/employee_onboarding_checklist/read-all-employee-onboarding-checklist" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
