import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { BranchPage } from "./branch/BranchPage";

export default function BranchManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/branch" to="/branch/read-all-branch" />}
        <ContentRoute path="/branch/read-all-branch" component={BranchPage} />
      </Switch>
    </Suspense>
  );
}
