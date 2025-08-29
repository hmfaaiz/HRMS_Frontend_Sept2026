import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { DeptPage } from "./department/DeptPage";

export default function DeptManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/department" to="/department/read-all-dept" />}
        <ContentRoute path="/department/read-all-dept" component={DeptPage} />
      </Switch>
    </Suspense>
  );
}
