import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { TicketEscalationPolicyPage } from "./ticket_escalation_policy/FormPage";

export default function TicketEscalationPolicyManagement() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect exact={true} from="/ticket_escalation_policy" to="/ticket_escalation_policy/read-all-ticket-escalation-policy" />
        <ContentRoute path="/ticket_escalation_policy/read-all-ticket-escalation-policy" component={TicketEscalationPolicyPage} />
      </Switch>
    </Suspense>
  );
}