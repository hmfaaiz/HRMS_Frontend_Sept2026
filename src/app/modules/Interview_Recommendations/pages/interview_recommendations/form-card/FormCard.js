import React, { useMemo } from "react";
import { useFormUIContext } from "../FormUIContext";
import { FormTable } from "../form-table/FormTable";
import { RecommendationModal } from "../modal/recommendationModal";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmployeePortalMenu from "../../../../../utils/common-modules/EmployeePortalMenu";
import EmployeeProfile from "../../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";

export function FormCard() {
  const formUIContext = useFormUIContext();
  const formUIProps = useMemo(() => {
    return {
      openRecommendationModal: formUIContext.openRecommendationModal,
      openViewModal: formUIContext.openViewModal,
      showModal: formUIContext.showModal,
      selectedInterviewId: formUIContext.selectedInterviewId,
      closeModal: formUIContext.closeModal,
      isViewOnly: formUIContext.isViewOnly,
    };
  }, [formUIContext]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
      {/* ── Left Panel — Employee Profile ── */}
      {/* <div className="px-1 md:mb-0 md:col-span-1 xl:col-span-3 flex flex-col gap-4">
        <div className="xl:hidden block">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            isBackButton={true}
            menuOptions={[]}
            isDashboardIcon={true}
          />
        </div> */}
        {/* This reads from state.auth.user automatically — same as appraisal form */}
        {/* <EmployeeProfile />
      </div> */}

      {/* ── Right Panel — Table ── */}
      <div className="md:col-span-1 xl:col-span-12 flex flex-col gap-4">
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
            openRecommendationModal={formUIProps.openRecommendationModal}
            openViewModal={formUIProps.openViewModal}
          />
        </div>
      </div>

      {/* ── Recommendation Modal ── */}
      <RecommendationModal
        show={formUIProps.showModal}
        interviewId={formUIProps.selectedInterviewId}
        onHide={formUIProps.closeModal}
isViewOnly={formUIProps.isViewOnly}      />

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