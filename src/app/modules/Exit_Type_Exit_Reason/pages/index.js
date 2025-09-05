import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./exit_type_exit_reason/FormPage";

export default function Roster_PatternManagement() {
  console.log("Exit Type & Exit Reason Module11111");
 
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/exit_type_exit_reason" to="/exit_type_exit_reason/read-all-exit-type-exit-reason" />}
        <ContentRoute path="/exit_type_exit_reason/read-all-exit-type-exit-reason" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
