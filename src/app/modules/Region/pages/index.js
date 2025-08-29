import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { RegionPage } from "./region/RegionPage";
 //import { ReligionPage } from "./Religion/ReligionPage";

export default function EmpPolicyManagement() {
  console.log('ttt mein aya')
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/region" to="/region/read-all-region" />}
        <ContentRoute path="/region/read-all-region" component={RegionPage} />
      </Switch>
    </Suspense>
  );
}
