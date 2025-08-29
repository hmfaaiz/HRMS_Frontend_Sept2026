import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { IncidentPage } from "./banks/BanksPage";

export default function IncidentManagement() {
  console.log('incident mein aya')
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/incident" to="/incident/read-all-incident" />}
        <ContentRoute path="/incident/read-all-incident" component={IncidentPage} />
      </Switch>
    </Suspense>
  );
}
