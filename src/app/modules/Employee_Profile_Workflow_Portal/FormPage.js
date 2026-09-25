import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
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


  //shared state for applicant detail toggle
  const [showApplicantDetails, setShowApplicantDetails] = useState(false);

  const FormUIEvents = {
    newFormButtonClick: () => {
      history.push("/employee_profile_workflow/read-all-employee-profile-workflow/new");
    },
    openEditFormDialog: (id) => {

      history.push(`/employee_profile_workflow/read-all-employee-profile-workflow/${id}/edit`);
    },
    openDeleteFormDialog: (id, status) => {
      history.push(`/employee_profile_workflow/read-all-employee-profile-workflow/${id}/${status}/delete`);
    },
    openActiveFormDialog: (id) => {
      history.push(`/employee_profile_workflow/read-all-employee-profile-workflow/${id}/active`);
    },
    openReadFormDialog: (id, isUserRead) => {

      history.push(`/employee_profile_workflow/read-all-employee-profile-workflow/${id}/read`);
    },
  };

  const { userAccess, employee_task, employee_profile_workflow } = useSelector((state) => {
    return {
      userAccess: state.auth.userAccess?.employee_profile_workflow || [],
      employee_task: state?.auth?.userAccess["Employee_Task"],
      employee_profile_workflow: state?.auth?.userAccess["Employee"],
    };
  }, shallowEqual);

  const employeeTaskItem = employee_task?.find(
    (el) =>
      el?.componentName === "ReadAllEmployeeTask" &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );

  const employeeProfileWorkflowItem = employee_profile_workflow?.find(
    (el) =>
      (el?.componentName === "ReadAllEmployeeProfileWorkflow") &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );

  const menuOptions = [
    {
      name: "Checklist Task",
      link: "/employee_task/read-all-employee-task",
      isShow: employeeTaskItem,
    },
  ];
  const accessUser = userAccess?.find(
    (item) => item.componentName === "CreateEmployeeProfileWorkflow"
  );

  const isAccessForView = userAccess?.find(
    (item) => item.componentName === "ReadEmployeeProfileWorkflow"
  );

  const isAccessForEdit = userAccess?.find((item) => {
    return item.componentName === "UpdateEmployeeProfileWorkflow";
  });
  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteEmployeeProfileWorkflow"
  );

  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Sidebar with Logged-in User Profile */}
        {/* <div className="px-1 md:mb-0 md:col-span-1 xl:col-span-3 flex flex-col gap-4">
          <div className="xl:hidden block">
            <EmployeePortalMenu
              name={CurrentModuleName()}
              isBackButton={true}
              menuOptions={menuOptions}
              isDashboardIcon={true}
            />
          </div>
          <EmployeeProfile />
        </div> */}

        {/* Main Content Area */}
        <div className="md:col-span-1 xl:col-span-12 flex flex-col gap-4">
          <div className="hidden xl:block">
            <EmployeePortalMenu
              name={CurrentModuleName()}
              isBackButton={true}
              menuOptions={menuOptions}
              isDashboardIcon={true}
            />
          </div>

          <div className="px-3 py-2 rounded-lg bg-white">
            <FormCard showApplicantDetails={showApplicantDetails} onApplicantDetailsChange={setShowApplicantDetails} />
          </div>
          <Switch>
            {/* NEW */}
            {accessUser && (
              <Route exact path="/employee_profile_workflow/read-all-employee-profile-workflow/new">
                {({ history, match }) => (
                  <FormEditDialog
                    show={match != null}
                    status="new"
                    onHide={() => history.push("/employee_profile_workflow/read-all-employee-profile-workflow")}
                  />
                )}
              </Route>
            )}

            {/* EDIT */}
            {isAccessForEdit && (
              <Route path="/employee_profile_workflow/read-all-employee-profile-workflow/:id/edit">
                {({ history, match }) => (
                  <FormEditDialog
                    show={match != null}
                    id={match?.params?.id}
                    status="edit"
                    onHide={() => history.push("/employee_profile_workflow/read-all-employee-profile-workflow")}
                  />
                )}
              </Route>
            )}
            {/* READ */}
            {isAccessForView && (
              <Route path="/employee_profile_workflow/read-all-employee-profile-workflow/:id/read">
                {({ history, match }) => (
                  <FormEditDialog
                    show={match != null}
                    id={match?.params?.id}
                    status="read"
                    dataForRead={true}
                    onHide={() => history.push("/employee_profile_workflow/read-all-employee-profile-workflow")}
                  />
                )}
              </Route>
            )}

            {/* DELETE */}
            {isAccessForDelete && (
              <Route path="/employee_profile_workflow/read-all-employee-profile-workflow/:id/:status/delete">
                {({ history, match }) => (
                  <FormDeleteDialog
                    show={match != null}
                    id={match?.params?.id}
                    status={match?.params?.status}
                    onHide={() => history.push("/employee_profile_workflow/read-all-employee-profile-workflow")}
                  />
                )}
              </Route>
            )}
          </Switch>
        </div>
      </div>

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

