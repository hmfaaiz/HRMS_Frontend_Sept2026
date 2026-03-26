import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./tada_configuration/FormPage";

export default function Tada_configurationManagement() {
  return (
    <>
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/tada_config" to="/tada_config/read-all-tada-config" />}
        <ContentRoute path="/tada_config/read-all-tada-config" component={FormPage} />
      </Switch>
    </Suspense></>
  );
}
