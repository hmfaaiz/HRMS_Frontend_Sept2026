import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./DesignationWiseGoalSetup/FormPage";

export default function DesignationWiseGoalSetupManagement() {

 
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/designation_wise_goal_setup" to="/designation_wise_goal_setup/read-all-designation-wise-goal-setup" />}
        <ContentRoute path="/designation_wise_goal_setup/read-all-designation-wise-goal-setup" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
