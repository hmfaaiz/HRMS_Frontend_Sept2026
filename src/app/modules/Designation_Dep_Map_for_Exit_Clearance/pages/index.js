import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./Designation_Dep_Map_for_Exit_Clearance/FormPage";

export default function designation_dep_map_for_exit_clearance_Management() {

 console.log("index111")
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/designation_dep_map_for_exit_clearance" to="/designation_dep_map_for_exit_clearance/read-all-designation-dep-map-for-exit-clearance" />}
        <ContentRoute path="/designation_dep_map_for_exit_clearance/read-all-designation-dep-map-for-exit-clearance" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
