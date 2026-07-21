import React, { useMemo } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useFormUIContext } from "../FormUIContext";
import { FormTable } from "../form-table/FormTable";
import { TaskModal } from "../modal/TaskModal";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmployeePortalMenu from "../../../../../utils/common-modules/EmployeePortalMenu";
import EmployeeProfile from "../../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";
import { FormTableExitClearance } from "../form-table/FormTableExitClearance";

export function FormCard() {
  const formUIContext = useFormUIContext();
  const formUIProps = useMemo(() => {
    return {
      openTaskModal: formUIContext.openTaskModal,
      openViewModal: formUIContext.openViewModal,
      showModal: formUIContext.showModal,
      selectedTaskId: formUIContext.selectedTaskId,
      closeModal: formUIContext.closeModal,
      isViewOnly: formUIContext.isViewOnly,
    };
  }, [formUIContext]);

  const { employee_profile_workflow_hrms } = useSelector((state) => {
    return {
      employee_profile_workflow_hrms: state?.auth?.userAccess["employee_profile_workflow_hrms"],
    };
  }, shallowEqual);

  const employeeProfileWorkflowItem = employee_profile_workflow_hrms?.find(
    (el) =>
      (el?.componentName === "ReadEmployeeProfileWorkflowHrms") &&
      el?.portalType == 1,
  );

  const menuOptions = [
    {
      name: "Personal Profile Change Workflow",
      link: "/employee_profile_workflow/read-all-employee-profile-workflow",
      isShow: employeeProfileWorkflowItem,
    },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
      {/* ── Left Panel — Employee Profile ── */}
      <div className="px-1 md:mb-0 md:col-span-1 xl:col-span-3 flex flex-col gap-4">
        <div className="xl:hidden block">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            isBackButton={true}
            menuOptions={menuOptions}
            isDashboardIcon={true}
          />
        </div>
        <EmployeeProfile />
      </div>

      {/* ── Right Panel — Table ── */}
      <div className="md:col-span-1 xl:col-span-9 flex flex-col gap-4">
        <div className="hidden xl:block">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            isBackButton={true}
            menuOptions={menuOptions}
            isDashboardIcon={true}
          />
        </div>

        <div className="px-3 py-2 rounded-lg bg-white">
          <FormTable
            openTaskModal={formUIProps.openTaskModal}
            openViewModal={formUIProps.openViewModal}
          />
        </div>

        <div className="px-3 py-2 rounded-lg bg-white">
          <FormTableExitClearance
            openTaskModal={formUIProps.openTaskModal}
            openViewModal={formUIProps.openViewModal}
          />
        </div>
      </div>

      {/* ── Task Modal ── */}
      <TaskModal
        show={formUIProps.showModal}
        taskId={formUIProps.selectedTaskId}
        onHide={formUIProps.closeModal}
        isViewOnly={formUIProps.isViewOnly}
      />

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
    </div>
  );
}
