import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { UploadPage } from "./forms/UploadPage";

export default function EmployeeLeaveBalanceManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/upload" to="/upload/upload-data" />}
        <ContentRoute path="/upload/upload-data" component={UploadPage} />
      </Switch>
    </Suspense>
  );
}
