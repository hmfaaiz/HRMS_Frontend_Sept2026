import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./loan_manag_conf/FormPage";

export default function loan_manag_confManagement() {

  return (

    <>
   
    
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/loan_management_configuration" to="/loan_management_configuration/read-all-loan-management-configuration" />}
        <ContentRoute path="/loan_management_configuration/read-all-loan-management-configuration" component={FormPage} />
      </Switch>
    </Suspense></>
  );
}
