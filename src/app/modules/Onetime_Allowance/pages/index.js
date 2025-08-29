import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { OnetimeAllowancePage } from "./forms/OnetimeAllowancePage"

export default function OnetimeAllowanceManagement() {
  console.log('onetime-earning page')
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/onetime_earning" to="/onetime_earning/read-all-onetime-earning" />}
        <ContentRoute path="/onetime_earning/read-all-onetime-earning" component={OnetimeAllowancePage} />
      </Switch>
    </Suspense>
  );
}
