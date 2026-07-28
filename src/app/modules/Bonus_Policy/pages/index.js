// pages/Bonus_Policy/index.js
import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./bonus_policy/FormPage";

export default function BonusPolicy() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect exact={true} from="/bonus_policy" to="/bonus_policy/read-all-bonus-policy" />
        <ContentRoute path="/bonus_policy/read-all-bonus-policy" component={FormPage} />
      </Switch>
    </Suspense>
  );
}