import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./appraisalGeneralEvaluationSetup/FormPage";

export default function AppraisalsManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>

      <Switch>
        {<Redirect exact={true} from="/general_evaluation_setup" to="/general_evaluation_setup/read-all-general-evaluation-setup" />}
        <ContentRoute path="/general_evaluation_setup/read-all-general-evaluation-setup" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
