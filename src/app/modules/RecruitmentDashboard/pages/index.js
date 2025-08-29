import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./form/FormPage";

export default function ResumeSearchEngineManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>

      <Switch>
        {<Redirect exact={true} from="/recruitment_dashboard" to="/recruitment_dashboard/read-all-recruitment-dashboard" />}
        <ContentRoute path="/recruitment_dashboard/read-all-recruitment-dashboard" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
