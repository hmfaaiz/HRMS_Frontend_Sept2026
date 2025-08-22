import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./form/FormPage";

export default function RecruitmentConfiguration() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>

      <Switch>
        {<Redirect exact={true} from="/career" to="/career/read-recruitment-config" />}
        <ContentRoute path="/career/read-recruitment-config" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
