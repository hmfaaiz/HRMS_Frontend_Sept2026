import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./companyDocument/FormPage";

export default function CompanyDocManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
    

      <Switch>
        {<Redirect exact={true} from="/company_doc" to="/company_doc/read-all-company-doc" />}
        <ContentRoute path="/company_doc/read-all-company-doc" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
