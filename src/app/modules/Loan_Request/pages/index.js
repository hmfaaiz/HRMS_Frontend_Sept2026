import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./employee_loan_request/FormPage";

export default function LoanRequest() {
  return (
    <>
      <Suspense fallback={<LayoutSplashScreen />}>
        <Switch>
          {
            <Redirect
              exact={true}
              from="/loan_request"
              to="/loan_request/read-all-loan-request"
            />
          }
          <ContentRoute
            path="/loan_request/read-all-loan-request"
            component={FormPage}
          />
        </Switch>
      </Suspense>
    </>
  );
}
