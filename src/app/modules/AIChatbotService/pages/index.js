import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./ai-chatbot-setup/FormPage";

export default function AIChatbotManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/ask" to="/ask/ai-chatbot" />}
        <ContentRoute path="/ask/ai-chatbot" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
