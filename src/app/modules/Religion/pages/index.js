import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { ReligionPage } from "./religion/ReligionPage";
 //import { ReligionPage } from "./Religion/ReligionPage";

export default function ReligionManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/regligion" to="/religion/read-all-religion" />}
        <ContentRoute path="/religion/read-all-religion" component={ReligionPage} />
      </Switch>
    </Suspense>
  );
}
