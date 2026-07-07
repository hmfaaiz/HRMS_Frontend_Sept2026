import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./asset_register/FormPage";

export default function AssetRegisterManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
    

      <Switch>
        {<Redirect exact={true} from="/asset_register" to="/asset_register/read-all-asset-register" />}
        <ContentRoute path="/asset_register/read-all-asset-register" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
