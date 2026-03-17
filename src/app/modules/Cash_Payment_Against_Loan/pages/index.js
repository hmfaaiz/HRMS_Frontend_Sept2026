import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./cash_payment_against_loan/FormPage";
import { useSelector, shallowEqual } from "react-redux"



export default function employee_loan_request() {

  return (

    <>
   
    
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
    
        {<Redirect exact={true} from="/cash_payment_against_loan" to="/cash_payment_against_loan/read-all-cash-payment-against-loan" />}
        <ContentRoute path="/cash_payment_against_loan/read-all-cash-payment-against-loan" component={FormPage} />
      </Switch>
    </Suspense>
    
    </>
  );
}
