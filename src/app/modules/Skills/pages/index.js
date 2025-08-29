import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { SkillPage } from "./banks/BanksPage";

export default function ExperienceManagement() {
  console.log('skills mein aya')
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact={true} from="/skills" to="/skills/read-all-skills" />}
        <ContentRoute path="/skills/read-all-skills" component={SkillPage} />
      </Switch>
    </Suspense>
  );
}
