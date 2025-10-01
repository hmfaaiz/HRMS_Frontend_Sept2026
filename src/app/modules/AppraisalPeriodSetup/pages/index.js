import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./appraisalPeriodSetup/FormPage";

export default function HolidaysManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>

      <Switch>
        {<Redirect exact={true} from="/appraisal_period_setup" to="/appraisal_period_setup/read-all-appraisal-period-setup" />}
        <ContentRoute path="/appraisal_period_setup/read-all-appraisal-period-setup" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
