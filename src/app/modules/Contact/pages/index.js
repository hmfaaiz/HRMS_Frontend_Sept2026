import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { ContactPage } from "./banks/BanksPage";

export default function ContactManagement() {
  console.log('contact page')
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/contact" to="/contact/read-all-contact" />}
        <ContentRoute path="/contact/read-all-contact" component={ContactPage} />
      </Switch>
    </Suspense>
  );
}
