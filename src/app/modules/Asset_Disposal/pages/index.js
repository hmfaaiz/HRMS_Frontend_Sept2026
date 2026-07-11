import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./asset_disposal/FormPage";

export default function AssetDisposalManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
    

      <Switch>
        {<Redirect exact={true} from="/asset_disposal" to="/asset_disposal/read-all-asset-disposal" />}
        <ContentRoute path="/asset_disposal/read-all-asset-disposal" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
