import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./asset_inspection_list/FormPage";

export default function AssetInspectionListManagement() {

 
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/asset_inspection_list" to="/asset_inspection_list/read-all-asset-inspection-list" />}
        <ContentRoute path="/asset_inspection_list/read-all-asset-inspection-list" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
