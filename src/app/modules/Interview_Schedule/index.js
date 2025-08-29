import React, { Suspense } from "react";
import { ContentRoute, LayoutSplashScreen } from "../../../_metronic/layout";
import { Switch, Redirect } from "react-router-dom";
import { InterviewSchedulePage } from "./page/InterviewSchedulePage";

export default function InterviewScheduleMangement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          <Redirect
            exact={true}
            from="/interview_schedule"
            to="/interview_schedule/read-interview-schedule"
          />
        }
        <ContentRoute
          path="/interview_schedule/read-interview-schedule"
          component={InterviewSchedulePage}
        />
      </Switch>
    </Suspense>
  );
}
