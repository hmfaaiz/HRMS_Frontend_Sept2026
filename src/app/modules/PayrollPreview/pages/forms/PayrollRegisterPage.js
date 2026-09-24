import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormFilter } from "./form-filter/FormFilter";
import { useSelector, useDispatch } from "react-redux";
import { FormUIProvider } from "./FormUIContext";
import CurrentModuleName from "../../../../utils/common-modules/ModuleName";
import EmployeePortalMenu from "../../../../utils/common-modules/EmployeePortalMenu";
import EmployeeProfile from "../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";

export function PayrollRegisterPage() {
  const dispatch = useDispatch();
  const { pdfLoading, loan } = useSelector((state) => ({
    pdfLoading: state.payroll_preview.pdfLoading,
    loan: state?.auth?.userAccess["Payroll"],
  }));

  return (
    <FormUIProvider FormUIEvents={{}}>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* <div className="px-1 md:mb-0 md:col-span-1 xl:col-span-3 flex flex-col gap-4">
          <div className="xl:hidden block">
            <EmployeePortalMenu
              name={CurrentModuleName()}
              isBackButton={true}
              menuOptions={[
                {
                  name: "Request",
                  link: "/loan_request/read-all-loan-request",
                  isShow: loan?.find(
                    (el) =>
                      el?.componentName === "ReadAllLoanRequest" &&
                      el?.isResourceShow
                  ),
                },
                {
                  name: "Approval",
                  link: "/loan_approval/read-all-loan-approval",
                  isShow: loan?.find(
                    (el) =>
                      el?.componentName === "ReadAllLoanApproval" &&
                      el?.isResourceShow
                  ),
                },
                {
                  name: "Workflow Status",
                  link: "/loan-workflow-status/read-all-loan-workflow-status",
                  isShow: loan?.find(
                    (el) =>
                      el?.componentName === "ReadAllLoanWorkflowStatus" &&
                      el?.isResourceShow
                  ),
                },
              ]}
              isDashboardIcon={true}
            />
          </div>
          <EmployeeProfile />
        </div> */}
        <div className="md:col-span-1 xl:col-span-12 flex flex-col gap-4">
          <div className="hidden xl:block">
            <EmployeePortalMenu
              name={CurrentModuleName()}
              isBackButton={true}
              menuOptions={[
                {
                  name: "Request",
                  link: "/loan_request/read-all-loan-request",
                  isShow: loan?.find(
                    (el) =>
                      el?.componentName === "ReadAllLoanRequest" &&
                      el?.isResourceShow
                  ),
                },
                {
                  name: "Approval",
                  link: "/loan_approval/read-all-loan-approval",
                  isShow: loan?.find(
                    (el) =>
                      el?.componentName === "ReadAllLoanApproval" &&
                      el?.isResourceShow
                  ),
                },
                {
                  name: "Workflow Status",
                  link: "/loan-workflow-status/read-all-loan-workflow-status",
                  isShow: loan?.find(
                    (el) =>
                      el?.componentName === "ReadAllLoanWorkflowStatus" &&
                      el?.isResourceShow
                  ),
                },
              ]}
              isDashboardIcon={true}
            />
          </div>
          <div className="px-3 py-2 rounded-lg bg-white">
            <FormFilter pdfLoading={pdfLoading} dispatch={dispatch} />
          </div>
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
