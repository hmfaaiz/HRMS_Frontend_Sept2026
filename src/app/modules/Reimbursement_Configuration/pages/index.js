import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./reimbursement_configuration/FormPage";

export default function Reimbursement_configurationManagement() {

  return (

    <>
   
    
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/reimbursement_configuration" to="/reimbursement_configuration/read-all-reimbursement-configuration" />}
        <ContentRoute path="/reimbursement_configuration/read-all-reimbursement-configuration" component={FormPage} />
      </Switch>
    </Suspense></>
  );
}
