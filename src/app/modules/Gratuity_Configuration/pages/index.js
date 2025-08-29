import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./gratuity_configuration/FormPage";

export default function Gratuity_configurationManagement() {
 
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/gratuity_configuration" to="/gratuity_configuration/read-all-gratuity-configuration" />}
        <ContentRoute path="/gratuity_configuration/read-all-gratuity-configuration" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
