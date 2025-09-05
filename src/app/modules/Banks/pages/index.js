import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { BanksPage } from "./banks/BanksPage";

export default function BankManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/bank" to="/bank/read-all-banks" />}
        <ContentRoute path="/bank/read-all-banks" component={BanksPage} />
      </Switch>
    </Suspense>
  );
}
