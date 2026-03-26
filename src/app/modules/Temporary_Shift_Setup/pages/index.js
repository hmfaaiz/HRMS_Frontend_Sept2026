import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { EmployeeTemporaryShiftPage } from "./temporary_shift_setup/FormPage";

export default function ProjectManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/temporary_shift_setup"
            to="/temporary_shift_setup/read-all-temporary-shift-setup"
          />
        }
        <ContentRoute
          path="/temporary_shift_setup/read-all-temporary-shift-setup"
          component={EmployeeTemporaryShiftPage}
        />
      </Switch>
    </Suspense>
  );
}
