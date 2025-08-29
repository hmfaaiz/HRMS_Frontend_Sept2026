import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { DeductionPage } from "./banks/BanksPage";

export default function DeductionManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/deduction" to="/deduction/read-all-deduction" />}
        <ContentRoute path="/deduction/read-all-deduction" component={DeductionPage} />
      </Switch>
    </Suspense>
  );
}
