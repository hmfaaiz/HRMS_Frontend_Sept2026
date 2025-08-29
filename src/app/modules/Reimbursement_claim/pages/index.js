import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./reimbursement_claim/FormPage";
import { useSelector, shallowEqual } from "react-redux"



export default function reimbursement_claim() {

  return (

    <>
   
    
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
    
        {<Redirect exact={true} from="/reimbursement_claim" to="/reimbursement_claim/read-all-reimbursement-claim" />}
        <ContentRoute path="/reimbursement_claim/read-all-reimbursement-claim" component={FormPage} />
      </Switch>
    </Suspense>
    
    </>
  );
}
