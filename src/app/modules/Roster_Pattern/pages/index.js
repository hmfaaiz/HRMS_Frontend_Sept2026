import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./roster_pattern/FormPage";

export default function Roster_PatternManagement() {
 
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/roster_pattern" to="/roster_pattern/read-all-roster-patter" />}
        <ContentRoute path="/roster_pattern/read-all-roster-pattern" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
