import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./tax_slab/FormPage";

export default function Tax_slabManagement() {
 
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/tax_slab" to="/tax_slab/read-all-tax-slab" />}
        <ContentRoute path="/tax_slab/read-all-tax-slab" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
