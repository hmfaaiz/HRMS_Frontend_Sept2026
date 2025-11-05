import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./Att_App_User/FormPage";

export default function AttAppUserConfiguration() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/app_user"
            to="/app_user/read-all-app-user"
          />
        }
        <ContentRoute to="/app_user/read-all-app-user" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
