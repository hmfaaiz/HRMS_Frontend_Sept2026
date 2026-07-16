import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { AssetListPage } from "../pages/asset_list/FormPage";

export default function AssetListManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/asset_list" to="/asset_list/read-all-asset-list" />}
        <ContentRoute path="/asset_list/read-all-asset-list" component={AssetListPage} />
      </Switch>
    </Suspense>
  );
}