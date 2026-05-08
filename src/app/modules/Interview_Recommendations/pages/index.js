// import React, { Suspense } from "react";
// import { Redirect, Switch } from "react-router-dom";
// import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
// import { InterviewRecommendationPage } from "../pages/interview_recommendations/FormPage";
// export default function InterviewRecommendationManagement() {
//   return (
//     <Suspense fallback={<LayoutSplashScreen />}>
//       <Switch>
//         {
//           <Redirect
//             exact={true}
//             from="/interview_recommendations"
//             to="/interview_recommendations/read-all-interview-recommendations"
//           />
//         }
//         <ContentRoute
//           path="/interview_recommendations/read-all-interview-recommendations"
//           component={InterviewRecommendationPage}
//         />
//       </Switch>
//     </Suspense>
//   );
// }
import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { InterviewRecommendationPage } from "../pages/interview_recommendations/FormPage";

export default function InterviewRecommendationManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact={true}
          from="/interview_recommendations"
          to="/interview_recommendations/read-all-interview-recommendations"
        />
        <ContentRoute
          path="/interview_recommendations/read-all-interview-recommendations"
          component={InterviewRecommendationPage}
        />
      </Switch>
    </Suspense>
  );
}