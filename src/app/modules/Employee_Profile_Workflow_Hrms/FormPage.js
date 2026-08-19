import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";
import { FormDynamicDialogModal } from "./form-delete-dialog/FormDynamicDialogModal";
import { useSelector, shallowEqual } from "react-redux";
import { Switch } from "react-router-dom";
import CurrentModuleName from "../../utils/common-modules/ModuleName";
import TCard from "../../utils/common-modules/TCard";
import { FormCard } from "./form-card/FormCard";
import EmployeeProfile from "../../modules/Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";
import EmployeePortalMenu from "../../utils/common-modules/EmployeePortalMenu";

export function FormPage({ history }) {

  // shared state for applicant detail toggle
  const [showApplicantDetails, setShowApplicantDetails] = useState(false);

  // Get values passed through history.push state
  const location = useLocation();

  const FormUIEvents = {
    newFormButtonClick: () => {
      history.push(
        "/employee_profile_workflow_hrms/read-all-employee-profile-workflow-hrms/new"
      );
    },

    openEditFormDialog: (id) => {

      // history.push(`/employee_profile_workflow_hrms/read-all-employee-profile-workflow-hrms/${id}/edit`);
      history.push({
        pathname:
          "/employee_profile_workflow_hrms/read-all-employee-profile-workflow-hrms/edit",
        state: {
          id,
        },
      });
    },

    openDeleteFormDialog: (id, status) => {

      // history.push(`/employee_profile_workflow_hrms/read-all-employee-profile-workflow-hrms/${id}/${status}/delete`);
      history.push({
        pathname:
          "/employee_profile_workflow_hrms/read-all-employee-profile-workflow-hrms/delete",
        state: {
          id,
          status,
        },
      });
    },

    openActiveFormDialog: (id) => {

      // history.push(`/employee_profile_workflow_hrms/read-all-employee-profile-workflow-hrms/${id}/active`);
      history.push({
        pathname:
          "/employee_profile_workflow_hrms/read-all-employee-profile-workflow-hrms/active",
        state: {
          id,
        },
      });
    },

    openReadFormDialog: (id, isUserRead) => {

      // history.push(`/employee_profile_workflow_hrms/read-all-employee-profile-workflow-hrms/${id}/read`);
      history.push({
        pathname:
          "/employee_profile_workflow_hrms/read-all-employee-profile-workflow-hrms/read",
        state: {
          id,
          isUserRead,
        },
      });
    },
  };

  const {
    userAccess,
    employee_task,
    employee_profile_workflow_hrms,
  } = useSelector((state) => {
    return {
      userAccess:
        state.auth.userAccess?.employee_profile_workflow_hrms || [],
      employee_task: state?.auth?.userAccess["Employee_Task"],
      employee_profile_workflow_hrms:
        state?.auth?.userAccess["employee_profile_workflow_hrms"],
    };
  }, shallowEqual);

  console.log("userAccess", userAccess);
  console.log("employee_profile", userAccess);

  const employeeTaskItem = employee_task?.find(
    (el) =>
      el?.componentName === "ReadAllEmployeeTask" &&
      el?.isResourceShow &&
      el?.portalType == 2
  );

  const employeeProfileWorkflowItem =
    employee_profile_workflow_hrms?.find(
      (el) =>
        el?.componentName ===
          "ReadEmployeeProfileWorkflowHrms" &&
        el?.portalType == 1
    );

  const menuOptions = [
    {
      name: "Personal Profile Change Workflow",
      link:
        "/employee_profile_workflow_hrms/read-all-employee-profile-workflow-hrms",
      isShow: employeeProfileWorkflowItem,
    },
    {
      name: "Checklist Task",
      link: "/employee_task/read-all-employee-task",
      isShow: employeeTaskItem,
    },
  ];

  const accessUser = userAccess?.find(
    (item) =>
      item.componentName ===
      "CreateEmployeeProfileWorkflowHrms"
  );

  const isAccessForView = userAccess?.find(
    (item) =>
      item.componentName ===
      "ReadEmployeeProfileWorkflowHrms"
  );

  const isAccessForEdit = userAccess?.find((item) => {
    return (
      item.componentName ===
      "UpdateEmployeeProfileWorkflowHrms"
    );
  });

  const isAccessForDelete = userAccess?.find(
    (item) =>
      item.componentName ===
      "DeleteEmployeeProfileWorkflowHrms"
  );

  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>

      <TCard name={CurrentModuleName()}>
        <FormCard
          showApplicantDetails={showApplicantDetails}
          onApplicantDetailsChange={setShowApplicantDetails}
        />
      </TCard>

      <Switch>

        {/* NEW */}
        {accessUser && (
          <Route
            exact
            path="/employee_profile_workflow_hrms/read-all-employee-profile-workflow-hrms/new"
          >
            {({ history, match }) => (
              <FormEditDialog
                show={match != null}
                status="new"
                onHide={() =>
                  history.push(
                    "/employee_profile_workflow_hrms/read-all-employee-profile-workflow-hrms"
                  )
                }
              />
            )}
          </Route>
        )}

        {/* EDIT */}
        {isAccessForEdit && (
          <Route
            // path="/employee_profile_workflow_hrms/read-all-employee-profile-workflow-hrms/:id/edit"
            path="/employee_profile_workflow_hrms/read-all-employee-profile-workflow-hrms/edit"
          >
            {({ history, match }) => (
              <FormEditDialog
                show={match != null}
                // id={match?.params?.id}
                id={location.state?.id}
                status="edit"
                onHide={() =>
                  history.push(
                    "/employee_profile_workflow_hrms/read-all-employee-profile-workflow-hrms"
                  )
                }
              />
            )}
          </Route>
        )}

        {/* READ */}
        {isAccessForView && (
          <Route
            // path="/employee_profile_workflow_hrms/read-all-employee-profile-workflow-hrms/:id/read"
            path="/employee_profile_workflow_hrms/read-all-employee-profile-workflow-hrms/read"
          >
            {({ history, match }) => (
              <FormEditDialog
                show={match != null}
                // id={match?.params?.id}
                id={location.state?.id}
                status="read"
                dataForRead={true}
                onHide={() =>
                  history.push(
                    "/employee_profile_workflow_hrms/read-all-employee-profile-workflow-hrms"
                  )
                }
              />
            )}
          </Route>
        )}

        {/* DELETE */}
        {isAccessForDelete && (
          <Route
            // path="/employee_profile_workflow_hrms/read-all-employee-profile-workflow-hrms/:id/:status/delete"
            path="/employee_profile_workflow_hrms/read-all-employee-profile-workflow-hrms/delete"
          >
            {({ history, match }) => (
              <FormDeleteDialog
                show={match != null}
                // id={match?.params?.id}
                id={location.state?.id}
                // status={match?.params?.status}
                status={location.state?.status}
                onHide={() =>
                  history.push(
                    "/employee_profile_workflow_hrms/read-all-employee-profile-workflow-hrms"
                  )
                }
              />
            )}
          </Route>
        )}

        {/* ACTIVE */}
        <Route
          // path="/employee_profile_workflow_hrms/read-all-employee-profile-workflow-hrms/:id/active"
          path="/employee_profile_workflow_hrms/read-all-employee-profile-workflow-hrms/active"
        >
          {({ history, match }) => (
            <FormDynamicDialogModal
              show={match != null}
              // id={match?.params?.id}
              id={location.state?.id}
              onHide={() =>
                history.push(
                  "/employee_profile_workflow_hrms/read-all-employee-profile-workflow-hrms"
                )
              }
            />
          )}
        </Route>

      </Switch>

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

