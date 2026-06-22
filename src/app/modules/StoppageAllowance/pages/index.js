import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { StoppageAllowancePage } from "./banks/BanksPage";

export default function StoppageManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/stoppage" to="/stoppage/read-all-stoppage" />}
        <ContentRoute path="/stoppage/read-all-stoppage" component={StoppageAllowancePage} />
      </Switch>
    </Suspense>
  );
}
