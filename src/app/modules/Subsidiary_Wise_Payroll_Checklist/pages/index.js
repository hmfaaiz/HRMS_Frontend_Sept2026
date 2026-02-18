import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./subsidiary_wise_payroll_checklist/FormPage";

export default function subsidiary_wise_onboarding_checklist() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/subsidiary_wise_payroll_checklist" to="/subsidiary_wise_payroll_checklist/read-all-subsidiary-wise-payroll-checklist" />}
        <ContentRoute path="/subsidiary_wise_payroll_checklist/read-all-subsidiary-wise-payroll-checklist" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
