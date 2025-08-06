import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormTable } from "./form-table/FormTable";
import { FormFilter } from "./form-filter/FormFilter";
import { Card } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllActiveEmployees,
  fetchAllActiveEmployeesBySubsidiary,
  fetchAllDept,
  fetchAllFormsMenu,
  fetchAllSubsidiaryData,
} from "../../../../../_metronic/redux/dashboardActions";
import { CardHeader } from "../../../../../_metronic/_partials/controls";
import CurrentModuleName from "../../../../utils/common-modules/ModuleName";
import ReportButton from "./AttendanceReportButton";
import TCard from "../../../../utils/common-modules/TCard";

export function AttendanceViewPage() {
  const dispatch = useDispatch();
  const {
    dashboard,
    listLoading,
    processLoading,
    consolidatedLoading,
    empWiseLoading,
    pdf2Loading,
    pdfLoading,
    excelLoading,
    csvLoading,
  } = useSelector((state) => ({
    dashboard: state.dashboard,
    listLoading: state.attendance.listLoading,
    processLoading: state.attendance.processLoading,
    consolidatedLoading: state.attendance.consolidatedLoading,
    empWiseLoading: state.attendance.empWiseLoading,
    pdf2Loading: state.attendance.pdf2Loading,
    csvLoading: state.attendance.csvLoading,
    excelLoading: state.attendance.excelLoading,
    pdfLoading: state.attendance.pdfLoading,
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
  }, [dispatch]);

  return (
    <FormUIProvider FormUIEvents={{}}>
      {/* < Card>
      
        <CardHeader title={CurrentModuleName()}>
        </CardHeader>

       <FormFilter dispatch={dispatch} pdfLoading={pdfLoading} csvLoading={csvLoading} excelLoading={excelLoading} pdf2Loading ={pdf2Loading} loading={listLoading} processLoading={processLoading} consolidatedLoading={consolidatedLoading} empWiseLoading={empWiseLoading}/>
      
        <FormTable />
      </Card > */}
      <TCard name={CurrentModuleName()}>
        <div>
          <FormFilter
            dispatch={dispatch}
            pdfLoading={pdfLoading}
            csvLoading={csvLoading}
            excelLoading={excelLoading}
            pdf2Loading={pdf2Loading}
            loading={listLoading}
            processLoading={processLoading}
            consolidatedLoading={consolidatedLoading}
            empWiseLoading={empWiseLoading}
          />
        </div>
        <FormTable />
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
