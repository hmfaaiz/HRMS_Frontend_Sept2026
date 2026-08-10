import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./bonus_process/FormPage";

export default function bonus_process() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect exact={true} from="/bonus_process" to="/bonus_process/read-all-bonus-process" />
        <ContentRoute path="/bonus_process/read-all-bonus-process" component={FormPage} />
      </Switch>
    </Suspense>
  );
}