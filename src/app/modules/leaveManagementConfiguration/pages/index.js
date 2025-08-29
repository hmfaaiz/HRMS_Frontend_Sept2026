import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { leaveManagementConfigurationPage } from "./forms/leaveManagementConfigurationPage";

export default function leaveManagementConfigurationManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/leave_management_configuration" to="/leave_management_configuration/read-all-leave-management-configuration" />}
        <ContentRoute path="/leave_management_configuration/read-all-leave-management-configuration" component={leaveManagementConfigurationPage} />
      </Switch>
    </Suspense>
  );
}
