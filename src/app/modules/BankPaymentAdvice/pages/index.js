import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./forms/FormPage"

export default function BankManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/bank_advice" to="/bank_advice/read-all-bank-advice" />}
        <ContentRoute path="/bank_advice/read-all-bank-advice" component={FormPage} />

   
      </Switch>
    </Suspense>
  );
}
