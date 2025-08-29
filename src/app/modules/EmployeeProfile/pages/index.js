import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { ProfilePage } from "./designation/DesignationPage";
 //import { ReligionPage } from "./Religion/ReligionPage";

export default function ProfileManagement() {

  
  return (
    
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/profile" to="/profile/read-all-profile" />}
        <ContentRoute path="/profile/read-all-profile" component={ProfilePage} />
       
      </Switch>
    </Suspense>
  );
}
