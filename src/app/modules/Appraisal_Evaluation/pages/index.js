import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./Appraisal_Evaluation/FormPage";

export default function AppraisalEvaluationManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/appraisal_evaluation"
            to="/appraisal_evaluation/read-all-appraisal-evaluation"
          />
        }
        <ContentRoute
          path="/appraisal_evaluation/read-all-appraisal-evaluation"
          component={FormPage}
        />
      </Switch>
    </Suspense>
  );
}
