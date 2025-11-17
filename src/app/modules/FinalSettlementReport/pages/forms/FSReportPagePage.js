import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FormFilter } from "./form-filter/FormFilter";
import {
  fetchAllDept,
  fetchAllFormsMenu,
  fetchAllSubsidiaryData,
} from "../../../../../_metronic/redux/dashboardActions";
import { useSelector, useDispatch } from "react-redux";
import { FormUIProvider } from "./FormUIContext";
import { CardHeader } from "../../../../../_metronic/_partials/controls";
import CurrentModuleName from "../../../../utils/common-modules/ModuleName";
import TCard from "../../../../utils/common-modules/TCard";

export function FSReportPage() {

  const dispatch = useDispatch();
  const {
    dashboard,
    listLoading,
    pdfLoading,
    payableSlip,
    incomeTaxComputationSlip,
    gratuitySlip,
    providentFundSlip,acknowledgementLetter
  } = useSelector((state) => ({
    dashboard: state.dashboard,
    listLoading: state.final_settlement_report.listLoading,
    pdfLoading: state.final_settlement_report.pdfLoading,
    payableSlip: state.final_settlement_report.payableSlip,
    incomeTaxComputationSlip: state.final_settlement_report.incomeTaxComputationSlip,
    gratuitySlip: state.final_settlement_report.gratuitySlip,
    providentFundSlip: state.final_settlement_report.providentFundSlip,
    acknowledgementLetter: state.final_settlement_report.acknowledgementLetter,

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
          payableSlip={payableSlip}
          incomeTaxComputationSlip={incomeTaxComputationSlip}
          gratuitySlip={gratuitySlip}
          providentFundSlip={providentFundSlip}
          acknowledgementLetter={acknowledgementLetter}
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
