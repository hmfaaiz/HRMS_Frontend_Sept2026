import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./employee_loan_request/FormPage";
import { useSelector, shallowEqual } from "react-redux"



export default function employee_loan_request() {

  return (

    <>
   
    
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
    
        {<Redirect exact={true} from="/employee_loan_request" to="/employee_loan_request/read-all-employee-loan-request" />}
        <ContentRoute path="/employee_loan_request/read-all-employee-loan-request" component={FormPage} />
      </Switch>
    </Suspense>
    
    </>
  );
}
