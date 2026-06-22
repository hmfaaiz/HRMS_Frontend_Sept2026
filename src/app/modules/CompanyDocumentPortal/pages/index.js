import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./companyDocument/FormPage";

export default function CompanyDocManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
    

      <Switch>
        {<Redirect exact={true} from="/company_doc_portal" to="/company_doc_portal/read-all-company-doc-portal" />}
        <ContentRoute path="/company_doc_portal/read-all-company-doc-portal" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
