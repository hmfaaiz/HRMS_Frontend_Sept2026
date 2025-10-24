import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./form/FormPage";

export default function ResignationRequestManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>

      <Switch>
        {<Redirect exact={true} from="/employee_resignation" to="/employee_resignation/read-all-resignation" />}
        <ContentRoute path="/employee_resignation/read-all-resignation" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
