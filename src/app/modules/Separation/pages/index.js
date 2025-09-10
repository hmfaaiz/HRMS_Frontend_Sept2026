import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./form/FormPage";

export default function ApplicantProfileManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>

      <Switch>
        {<Redirect exact={true} from="/separation" to="/separation/read-all-separation" />}
        <ContentRoute path="/separation/read-all-separation" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
