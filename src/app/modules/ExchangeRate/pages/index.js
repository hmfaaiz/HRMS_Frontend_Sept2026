import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { ExchangeRatePage } from "./banks/BanksPage";

export default function ExchangeRateManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/exchange" to="/exchange/read-all-exchange-rate" />}
        <ContentRoute path="/exchange/read-all-exchange-rate" component={ExchangeRatePage} />
      </Switch>
    </Suspense>
  );
}
