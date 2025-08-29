import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { ExperiencePage } from "./banks/BanksPage";

export default function ExperienceManagement() {
  console.log('experience mein aya')
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/experience" to="/experience/read-all-experience" />}
        <ContentRoute path="/experience/read-all-experience" component={ExperiencePage} />
      </Switch>
    </Suspense>
  );
}
