import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { DeductionTranPage } from "./banks/BanksPage";

export default function DeductionTransactionManagement() {
  console.log('deduction transaction mein aya')
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/deduction_transaction" to="/deduction_transaction/read-all-deduction-transaction" />}
        <ContentRoute path="/deduction_transaction/read-all-deduction-transaction" component={DeductionTranPage} />
      </Switch>
    </Suspense>
  );
}
