import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FSReportPage } from "./forms/FSReportPagePage";


export default function FinalSettlementReportManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/final_settlement_report" to="/final_settlement_report/read-all-final-settlement-report" />}
        <ContentRoute path="/final_settlement_report/read-all-final-settlement-report" component={FSReportPage} />

      


   
      </Switch>

      
    </Suspense>
  );
}
