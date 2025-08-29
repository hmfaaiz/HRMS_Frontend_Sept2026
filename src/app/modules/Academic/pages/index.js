import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { AcademicPage } from "./banks/BanksPage";

export default function AcademicManagement() {
  console.log('academic mein aya')
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/academic" to="/academic/read-all-academic" />}
        <ContentRoute path="/academic/read-all-academic" component={AcademicPage} />
      </Switch>
    </Suspense>
  );
}
