import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { AttendanceConfigPage } from "./forms/AttendanceConfigPage";

export default function AttendanceConfigurationManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/attendance_configuration" to="/attendance_configuration/read-all-att-configuration" />}
        <ContentRoute path="/attendance_configuration/read-all-att-configuration" component={AttendanceConfigPage} />
      </Switch>
    </Suspense>
  );
}
