import React, { useMemo } from "react";
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

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
      {/* ── Left Panel — Employee Profile ── */}
      <div className="px-1 md:mb-0 md:col-span-1 xl:col-span-3 flex flex-col gap-4">
        <div className="xl:hidden block">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            isBackButton={true}
            menuOptions={[]}
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
            menuOptions={[]}
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
