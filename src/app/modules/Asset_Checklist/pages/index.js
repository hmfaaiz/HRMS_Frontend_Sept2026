import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./asset_checklist/FormPage";

export default function AssetChecklistManagement() {
console.log("AssetChecklistManagement1111")
 
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/asset_checklist" to="/asset_checklist/read-all-asset-checklist" />}
        <ContentRoute path="/asset_checklist/read-all-asset-checklist" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
