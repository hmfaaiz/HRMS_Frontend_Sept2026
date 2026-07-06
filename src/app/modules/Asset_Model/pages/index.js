import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./asset_model/FormPage";

export default function Asset_ModelManagement() {

 
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/asset_model" to="/asset_model/read-all-asset-model" />}
        <ContentRoute path="/asset_model/read-all-asset-model" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
