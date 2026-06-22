import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { EarningDeductionTranPage } from "./banks/BanksPage";

export default function EarningTransactionManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/earning_transaction" to="/earning_transaction/read-all-earning-transaction" />}
        <ContentRoute path="/earning_transaction/read-all-earning-transaction" component={EarningDeductionTranPage} />
      </Switch>
    </Suspense>
  );
}
