import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./RequisitionJobVacancy/FormPage";

export default function RequisitionJobVacancyManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>

      <Switch>
        {<Redirect exact={true} from="/requisition_job_vacancy" to="/requisition_job_vacancy/read-all-requisition-job-vacancy" />}
        <ContentRoute path="/requisition_job_vacancy/read-all-requisition-job-vacancy" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
