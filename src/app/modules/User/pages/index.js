import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./user/FormPage";

export default function UserManagement() {

  return (
 
    <Suspense fallback={<LayoutSplashScreen />}>

      <Switch>
        {<Redirect exact={true} from="/user" to="/user/read-all-user" />}
        <ContentRoute path="/user/read-all-user" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
