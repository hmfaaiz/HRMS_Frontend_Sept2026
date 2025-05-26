import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./form/FormPage";

export default function ResumeSearchEngineManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>

      <Switch>
        {<Redirect exact={true} from="/resume_search_engine" to="/resume_search_engine/read-all-resume-search-engine" />}
        <ContentRoute path="/resume_search_engine/read-all-resume-search-engine" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
