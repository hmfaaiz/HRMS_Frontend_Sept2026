import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { PayrollRegisterPage } from "./forms/PayrollRegisterPage";


export default function PayrollRegisterManagement() {
  console.log("aaa11111")
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/final_settlement_report" to="/final_settlement_report/read-all-final-settlement-report" />}
        <ContentRoute path="/final_settlement_report/read-all-final-settlement-report" component={PayrollRegisterPage} />

      


   
      </Switch>

      
    </Suspense>
  );
}
