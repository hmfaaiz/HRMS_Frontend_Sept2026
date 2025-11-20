import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { ReportPage } from "./forms/Page";

export default function ReportManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/gratuity_report" to="/gratuity_report/read-all-gratuity-report" />}
        <ContentRoute path="/gratuity_report/read-all-gratuity-report" component={ReportPage} />
      </Switch>
    </Suspense>
  );
}
