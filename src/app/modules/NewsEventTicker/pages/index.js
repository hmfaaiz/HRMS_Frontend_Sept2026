import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./newsEventTicker/FormPage";

export default function HolidaysManagement() {

  return (
    <Suspense fallback={<LayoutSplashScreen />}>

      <Switch>
        {<Redirect exact={true} from="/news_event_ticker" to="/news_event_ticker/read-all-news-event-ticker" />}
        <ContentRoute path="/news_event_ticker/read-all-news-event-ticker" component={FormPage} />
      </Switch>
    </Suspense>
  );
}
