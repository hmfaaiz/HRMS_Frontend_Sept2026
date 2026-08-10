import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { CompensatoryLeaveViewPage } from "./forms/AttendanceViewPage";

export default function AttendanceManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
       
      
        <ContentRoute path="/cpl_approval/read-all-cpl-Approval" component={CompensatoryLeaveViewPage} />
      </Switch>
    </Suspense>
  );
}
