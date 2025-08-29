import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { DesignationPage } from "./designation/DesignationPage";
 //import { ReligionPage } from "./Religion/ReligionPage";

export default function DesignationManagement() {
  console.log('religion mein aya')
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/designation" to="/designation/read-all-designation" />}
        <ContentRoute path="/designation/read-all-designation" component={DesignationPage} />
      </Switch>
    </Suspense>
  );
}
