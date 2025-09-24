import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { AuditTrailReportPage } from "./forms/AuditTrailReportPage";

export default function AuditTrailManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/audit_trail" to="/audit_trail/read-all-audit-trail-report" />}
        <ContentRoute path="/audit_trail/read-all-audit-trail-report" component={AuditTrailReportPage} />
      </Switch>
    </Suspense>
  );
}
