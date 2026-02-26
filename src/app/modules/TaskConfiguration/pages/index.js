import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./taskConfiguration/FormPage";

export default function TaskConfigurationManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>

      <Switch>
        {<Redirect exact={true} from="/task_configuration" to="/task_configuration/read-all-task-configuration" />}
        <ContentRoute path="/task_configuration/read-all-task-configuration" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
