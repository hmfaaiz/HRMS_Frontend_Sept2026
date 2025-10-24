import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
import { FormPage } from "./FromPage";

export default function ResignationApprovalManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/resignation_approval"
            to="/resignation_approval/read-all-resignation-approval"
          />
        }
        <ContentRoute
          path="/resignation_approval/read-all-resignation-approval"
          component={FormPage}
        />
      </Switch>
    </Suspense>
  );
}
