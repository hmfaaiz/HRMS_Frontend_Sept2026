import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./form/FormPage";

export default function FinalSettlementManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>

      <Switch>
        {<Redirect exact={true} from="/final_settlement" to="/final_settlement/read-all-final-settlement" />}
        <ContentRoute path="/final_settlement/read-all-final-settlement" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
