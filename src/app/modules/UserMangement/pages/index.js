import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { UsersPage } from "./users/UsersPage";
import Welcome from "./users/test";

export default function UserManagment() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {/* <ContentRoute path="/" component={UsersPage} /> */}
        {<Redirect exact={true} from="/users" to="/users/read-all-users" />}
        <ContentRoute path="/users/read-all-users" component={UsersPage} />
        <ContentRoute path="/users/read-all-access" component={Welcome} />
      </Switch>
    </Suspense>
  );
}
