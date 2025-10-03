import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./appraisalHrEvaluationSetup/FormPage";

export default function AppraisalsManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>

      <Switch>
        {<Redirect exact={true} from="/hr_evaluation_setup" to="/hr_evaluation_setup/read-all-hr-evaluation-setup" />}
        <ContentRoute path="/hr_evaluation_setup/read-all-hr-evaluation-setup" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
