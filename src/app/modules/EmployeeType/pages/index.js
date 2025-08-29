import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { EmpTypePage } from "./emptype/EmpTypePage";
// import { EmpTypePage } from "./empt";
 //import { ReligionPage } from "./Religion/ReligionPage";

export default function EmployeeTypeManagement() {
  console.log('EmployeeType mein aya')
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/emptype" to="/emptype/read-all-emptype" />}
        <ContentRoute path="/emptype/read-all-emptype" component={EmpTypePage} />
      </Switch>
    </Suspense>
  );
}
