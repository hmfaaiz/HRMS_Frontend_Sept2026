import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./accrue_gratuity_configuration/FormPage";

export default function Gratuity_configurationManagement() {
 
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/accrue_gratuity_configuration" to="/accrue-gratuity_configuration/read-all-accrue-gratuity-configuration" />}
        <ContentRoute path="/accrue_gratuity_configuration/read-all-accrue-gratuity-configuration" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
