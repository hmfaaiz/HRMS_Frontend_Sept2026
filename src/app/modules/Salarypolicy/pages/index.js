import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { SalarypolicyPage } from "./salarypolicy/SalarypolicyPage";

export default function SalarypolicyManagement() {
 
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/salary_policy" to="/salary_policy/read-all-salarypolicy" />}
        <ContentRoute path="/salary_policy/read-all-salarypolicy" component={SalarypolicyPage} />
      </Switch>
    </Suspense>
  );
}
