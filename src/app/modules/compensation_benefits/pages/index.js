import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { CompensationBenefitsPage } from "./banks/BanksPage";

export default function CompensationBenefitsManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/compensation" to="/compensation/read-all-compensation-benefits" />}
        <ContentRoute path="/compensation/read-all-compensation-benefits" component={CompensationBenefitsPage} />
      </Switch>
    </Suspense>
  );
}
