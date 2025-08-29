import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { AllocateLeavesPage } from "./forms/AllocateLeavesPage";

export default function AllocateLeavesManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/allocate_leaves" to="/allocate_leaves/read-all-allocate-leaves" />}
        <ContentRoute path="/allocate_leaves/read-all-allocate-leaves" component={AllocateLeavesPage} />
      </Switch>
    </Suspense>
  );
}
