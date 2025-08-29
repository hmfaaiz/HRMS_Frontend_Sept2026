import React, { useState } from "react";
import { FormUIProvider } from "./FormUIContext";
import { Route, Switch } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";
import { ToastContainer } from "react-toastify";
import WorkFlowFormEditDailog from "./form-edit-dialog/WorkflowFormEditDialog";
import { Tab, Tabs } from "@material-ui/core";
import { WorkflowDeleteDialog } from "./delete-dialog/WorkflowDeleteDialog";
import WorkflowFormCard from "./form-card/WorkflowFormCard";
import DesignationWorkflowFormCard from "./form-card/DesignationWorkflowFormCard";
import { DesignationWorkflowDeleteDialog } from "./delete-dialog/DesignationWorkflowDeleteDialog";
import DesignationWorkFlowFormEditDailog from "./form-edit-dialog/DesignationWorkflowFormEditDialog";
import { DuplicateDialog } from "./duplicate_dialog/DuplicateDialog";

export function WorkflowPolicyPage({ history }) {
  const [value, setValue] = useState(0);
  const componentEvents = {
    newButtonClick: () => {
      history.push("/workflow_policy/read-all-workflow-policy/new");
    },
    openEditDialog: (id) => {
      history.push(`/workflow_policy/read-all-workflow-policy/${id}/edit`);
    },
    openDeleteDialog: (id, status) => {
      history.push(`/workflow_policy/read-all-workflow-policy/${id}/delete`);
    },
    openReadDialog: (id) => {
      history.push(`/workflow_policy/read-all-workflow-policy/${id}/read`);
    },
    // for designation workflow policy
    newButtonDesigClick: () => {
      history.push("/workflow_policy/read-all-workflow-policy/designation/new");
    },
    openEditDesigDialog: (id) => {
      history.push(
        `/workflow_policy/read-all-workflow-policy/designation/${id}/edit`
      );
    },
    openDeleteDesigDialog: (id, status) => {
      history.push(
        `/workflow_policy/read-all-workflow-policy/designation/${id}/delete`
      );
    },
    openReadDesigDialog: (id) => {
      history.push(
        `/workflow_policy/read-all-workflow-policy/designation/${id}/read`
      );
    },
    openDuplicateDesigDialog: (id) => {
      history.push(
        `/workflow_policy/read-all-workflow-policy/${id}/duplicate-designation`
      );
    },
  };
  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state?.auth?.userAccess?.workflow_policy,
    }),
    shallowEqual
  );

  const accessPage = userAccess.find(
    (item) => item.componentName === "CreateWorkflowPolicy"
  );
  const accessDesigPage = userAccess.find(
    (item) => item.componentName === "CreateDesignationWorkflowPolicy"
  );

  return (
    <FormUIProvider FormUIEvents={componentEvents}>
      <Switch>
        <Route
          exact={true}
          path="/workflow_policy/read-all-workflow-policy/new"
        >
          {({ history, match }) => (
            <WorkFlowFormEditDailog
              show={match != null}
              onHide={() => {
                history.push("/workflow_policy/read-all-workflow-policy");
              }}
            />
          )}
        </Route>
        <Route
          exact={true}
          path="/workflow_policy/read-all-workflow-policy/:id/edit"
        >
          {({ history, match }) => (
            <WorkFlowFormEditDailog
              show={match != null}
              onHide={() => {
                history.push("/workflow_policy/read-all-workflow-policy");
              }}
            />
          )}
        </Route>
        <Route
          exact={true}
          path="/workflow_policy/read-all-workflow-policy/:id/read"
        >
          {({ history, match }) => (
            <WorkFlowFormEditDailog
              isUserForRead={true}
              show={match != null}
              onHide={() => {
                history.push("/workflow_policy/read-all-workflow-policy");
              }}
            />
          )}
        </Route>
        <Route
          exact={true}
          path="/workflow_policy/read-all-workflow-policy/:id/delete"
        >
          {({ history, match }) => (
            <WorkflowDeleteDialog
              show={match != null}
              onHide={() => {
                history.push("/workflow_policy/read-all-workflow-policy");
              }}
            />
          )}
        </Route>
        <Route
          exact={true}
          path="/workflow_policy/read-all-workflow-policy/designation/new"
        >
          {({ history, match }) => (
            <DesignationWorkFlowFormEditDailog
              show={match != null}
              onHide={() => {
                history.push("/workflow_policy/read-all-workflow-policy");
              }}
            />
          )}
        </Route>
        <Route
          exact={true}
          path="/workflow_policy/read-all-workflow-policy/designation/:id/edit"
        >
          {({ history, match }) => (
            <DesignationWorkFlowFormEditDailog
              show={match != null}
              onHide={() => {
                history.push("/workflow_policy/read-all-workflow-policy");
              }}
            />
          )}
        </Route>
        <Route
          exact={true}
          path="/workflow_policy/read-all-workflow-policy/designation/:id/read"
        >
          {({ history, match }) => (
            <DesignationWorkFlowFormEditDailog
              isUserForRead={true}
              show={match != null}
              onHide={() => {
                history.push("/workflow_policy/read-all-workflow-policy");
              }}
            />
          )}
        </Route>
        <Route
          exact={true}
          path="/workflow_policy/read-all-workflow-policy/designation/:id/delete"
        >
          {({ history, match }) => (
            <DesignationWorkflowDeleteDialog
              show={match != null}
              onHide={() => {
                history.push("/workflow_policy/read-all-workflow-policy");
              }}
            />
          )}
        </Route>
        <Route
          exact={true}
          path="/workflow_policy/read-all-workflow-policy/:id/duplicate-designation"
        >
          {({ history, match }) => (
            <DuplicateDialog
              show={match != null}
              onHide={() => {
                history.push("/workflow_policy/read-all-workflow-policy");
              }}
            />
          )}
        </Route>
      </Switch>
      {/* <Tabs value={value} onChange={handleChange1}>
        <Tab
          style={{
            backgroundColor: "#0093dd",
            borderTopLeftRadius: "0.5rem",
            borderTopRightRadius: "0.5rem",
            color: "white",
          }}
          label="Workflow Policy"
        />
        <Tab
          style={{
            backgroundColor: "#0093dd",
            borderTopLeftRadius: "0.5rem",
            borderTopRightRadius: "0.5rem",
            color: "white",
          }}
          label="Designation Workflow Policy"
        />
      </Tabs> */}
      {value === 0 && (
        <WorkflowFormCard
          value={value}
          setValue={setValue}
          accessPage={accessPage}
        />
      )}
      {value === 1 && (
        <DesignationWorkflowFormCard
          value={value}
          setValue={setValue}
          accessPage={accessDesigPage}
        />
      )}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </FormUIProvider>
  );
}
