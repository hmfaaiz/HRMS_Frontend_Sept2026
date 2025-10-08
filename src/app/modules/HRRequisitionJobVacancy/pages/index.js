import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./HRRequisitionJobVacancy/FormPage";

export default function HRRequisitionJobVacancyManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>

      <Switch>
        {<Redirect exact={true} from="/hr_requisition_job_vacancy" to="/hr_requisition_job_vacancy/read-all-hr-requisition-job-vacancy" />}
        <ContentRoute path="/hr_requisition_job_vacancy/read-all-hr-requisition-job-vacancy" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
