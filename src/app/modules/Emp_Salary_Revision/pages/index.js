import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { FormPage } from "./emp_salary_revision/FormPage";




export default function emp_salary_revisionPage() {

  return (

    <>
   
    
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
    
        {<Redirect exact={true} from="/emp_salary_revision" to="/emp_salary_revision/read-all-employee-salary-revision" />}
        <ContentRoute path="/emp_salary_revision/read-all-employee-salary-revision" component={FormPage} />
      </Switch>
    </Suspense>
    
    </>
  );
}
