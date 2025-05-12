import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./jobVacancy/FormPage";

export default function JobVacancyManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>

      <Switch>
        {<Redirect exact={true} from="/job_vacancy" to="/job_vacancy/read-all-job-vacancy" />}
        <ContentRoute path="/job_vacancy/read-all-job-vacancy" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
