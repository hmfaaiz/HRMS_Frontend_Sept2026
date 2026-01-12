import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FacilitatorSetupPage} from "./facilitator_setup/Facilitator_SetupPage"

export default function FacilitatorManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/facilitator_setup" to="/facilitator_setup/read-all-facilitator-setup" />}
        <ContentRoute path="/facilitator_setup/read-all-facilitator-setup" component={FacilitatorSetupPage} />
      </Switch>
    </Suspense>
  );
}
