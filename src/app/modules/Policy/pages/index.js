import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { PolicyPage } from "./designation/DesignationPage";
 //import { ReligionPage } from "./Religion/ReligionPage";

export default function DesignationManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/policy" to="/policy/read-all-policy" />}
        <ContentRoute path="/policy/read-all-policy" component={PolicyPage} />
      </Switch>
    </Suspense>
  );
}
