import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FinalSettlementPolicyPage } from "./forms/FinalSettlementPolicyPage";

export default function FiscalSetupManagement() {
  console.log('Final settlement policy')
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/final_settlement_policy" to="/final_settlement_policy/read-all-final-settlement-policy" />}
        <ContentRoute path="/final_settlement_policy/read-all-final-settlement-policy" component={FinalSettlementPolicyPage} />
      </Switch>
    </Suspense>
  );
}
