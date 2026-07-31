import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { BonusRegisterPage } from "./bonus_register/FormPage";
import { BonusRegisterPreviewPage } from "./bonus_register/preview/Bonusregisterpreviewpage"; 

export default function BonusRegisterManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect exact={true} from="/bonus_register" to="/bonus_register/read-all-registered-bonus" />
        <ContentRoute path="/bonus_register/read-all-registered-bonus" component={BonusRegisterPage} />

        <ContentRoute path="/bonus_register/preview-registered-bonus-pdf" component={BonusRegisterPreviewPage} />
      </Switch>
    </Suspense>
  );
}