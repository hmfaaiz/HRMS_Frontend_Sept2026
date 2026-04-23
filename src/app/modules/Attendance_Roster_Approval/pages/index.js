import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./attendance_roster_approval/RosterApprovalPage";

export default function ReimbursementClaimApproval() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact={true}
          from="/attendance_roster_approval"
          to="/attendance_roster_approval/read-all-attendance-roster-approval"
        />
        <ContentRoute
          path="/attendance_roster_approval/read-all-attendance-roster-approval"
          component={FormPage}
        />
      </Switch>
    </Suspense>
  );
}