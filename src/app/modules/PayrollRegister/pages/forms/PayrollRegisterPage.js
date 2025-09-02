import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card } from "react-bootstrap";
import { FormTable } from "./form-table/FormTable";
import { FormFilter } from "./form-filter/FormFilter";
import {
  fetchAllActiveEmployees,
  fetchAllDept,
  fetchAllFormsMenu,
  fetchAllPayrollMonthYearList,
  fetchAllSubsidiaryData,
} from "../../../../../_metronic/redux/dashboardActions";
import { useSelector, useDispatch } from "react-redux";
import { FormUIProvider } from "./FormUIContext";
import { CardHeader } from "../../../../../_metronic/_partials/controls";
import CurrentModuleName from "../../../../utils/common-modules/ModuleName";
import TCard from "../../../../utils/common-modules/TCard";

export function PayrollRegisterPage() {
  const dispatch = useDispatch();
  const {
    dashboard,
    listLoading,
    pdfLoading,
    registerLoading,
    registerExcelLoading,
    adviceLoading,
    registerPreviewLoading,
    payslipPreviewLoading,
  } = useSelector((state) => ({
    dashboard: state.dashboard,
    listLoading: state.payroll_register.listLoading,
    pdfLoading: state.payroll_register.pdfLoading,
    registerLoading: state.payroll_register.registerLoading,
    registerExcelLoading: state.payroll_register.registerExcelLoading,
    adviceLoading: state.payroll_register.adviceLoading,
    registerPreviewLoading: state.payroll_register.registerPreviewLoading,
    payslipPreviewLoading: state.payroll_register.payslipPreviewLoading,
  }));

  //Get all Dropdown data from server on page load and set it in state
  useEffect(() => {
    if (
      !dashboard?.allEmployeeGradeList ||
      !dashboard?.allEmployeeGradeList?.length
    )
      dispatch(fetchAllFormsMenu(143, "allEmployeeGradeList"));

    if (!dashboard?.allSubsidiaryList?.length)
      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));

    if (!dashboard?.allDesignations || !dashboard?.allDesignations?.length)
      dispatch(fetchAllFormsMenu(158, "allDesignations"));

    if (
      !dashboard?.allLocationChildMenus ||
      !dashboard?.allLocationChildMenus?.length
    )
      dispatch(fetchAllFormsMenu(89, "allLocationChildMenus"));

    if (!dashboard?.allDept || !dashboard?.allDept?.length)
      dispatch(fetchAllDept());
  }, [dispatch]);

  return (
    <FormUIProvider FormUIEvents={{}}>
      {/* <Card> */}
      {/* Card Starts */}

      {/* <CardHeader title={CurrentModuleName()}></CardHeader> */}

      {/* Filter Form Starts */}
      {/* <FormFilter
          loading={listLoading}
          pdfLoading={pdfLoading}
          dispatch={dispatch}
          registerLoading={registerLoading}
          adviceLoading={adviceLoading}
          registerExcelLoading={registerExcelLoading}
          registerPreviewLoading={registerPreviewLoading}
          payslipPreviewLoading={payslipPreviewLoading}
        /> */}
      {/* Filter Form Ends */}

      {/* Table Starts */}
      {/* <FormTable /> */}
      {/* Table Ends */}

      {/* Card Ends */}
      {/* </Card> */}
      <TCard name={CurrentModuleName()}>
        <FormFilter
          loading={listLoading}
          pdfLoading={pdfLoading}
          dispatch={dispatch}
          registerLoading={registerLoading}
          adviceLoading={adviceLoading}
          registerExcelLoading={registerExcelLoading}
          registerPreviewLoading={registerPreviewLoading}
          payslipPreviewLoading={payslipPreviewLoading}
        />
        {/* FormEditDialog Ends */}

        <br />
        {/* <hr /> */}
      
      </TCard>
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
