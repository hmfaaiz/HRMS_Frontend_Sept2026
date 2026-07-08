import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./asset_register/FormPage";

export default function AssetAssignmentManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
    

      <Switch>
        {<Redirect exact={true} from="/asset_assignment" to="/asset_assignment/read-all-asset-assignment" />}
        <ContentRoute path="/asset_assignment/read-all-asset-assignment" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
