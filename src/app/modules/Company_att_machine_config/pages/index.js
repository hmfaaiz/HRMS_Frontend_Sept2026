import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./company_att_machine_config/FormPage";

export default function CompanyAttMachineConfigManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>

      <Switch>
        {<Redirect exact={true} from="/company_att_machine_config" to="/company_att_machine_config/read-all-att-machine-config" />}
        <ContentRoute path="/company_att_machine_config/read-all-att-machine-config" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
