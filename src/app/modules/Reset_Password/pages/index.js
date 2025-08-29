import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./reset_password/FormPage";
import { useSelector, shallowEqual } from "react-redux"



export default function password() {

  return (

    <>
   
    
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
    
        {<Redirect exact={true} from="/password" to="/password/reset-password" />}
        <ContentRoute path="/password/reset-password" component={FormPage} />
      </Switch>
    </Suspense>
    
    </>
  );
}
