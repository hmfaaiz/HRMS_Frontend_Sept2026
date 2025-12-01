import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./employeeDocument/FormPage";

export default function EmployeeDocManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
    

      <Switch>
        {<Redirect exact={true} from="/employee_doc" to="/employee_doc/read-all-employee-doc" />}
        <ContentRoute path="/employee_doc/read-all-employee-doc" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
