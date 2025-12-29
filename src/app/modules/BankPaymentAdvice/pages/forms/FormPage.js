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

export function FormPage() {
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
    listLoading: state.bank_advice.listLoading,
    pdfLoading: state.bank_advice.pdfLoading,
    registerLoading: state.bank_advice.registerLoading,
    registerExcelLoading: state.bank_advice.registerExcelLoading,
    adviceLoading: state.bank_advice.adviceLoading,
    registerPreviewLoading: state.bank_advice.registerPreviewLoading,
    payslipPreviewLoading: state.bank_advice.payslipPreviewLoading,
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
