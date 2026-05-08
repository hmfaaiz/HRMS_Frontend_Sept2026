import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./interview_questionnaire/FormPage";

export default function InterviewQuenstionnaireManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>

      <Switch>
        {<Redirect exact={true} from="/interview_questionnaire" to="/interview_questionnaire/read-all-interview-questionnaire" />}
        <ContentRoute path="/interview_questionnaire/read-all-interview-questionnaire" component={FormPage} />
      </Switch>
    </Suspense>
  );
}

