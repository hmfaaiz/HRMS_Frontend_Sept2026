import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormTable } from "./form-table/FormTable";
import { FormFilter } from "./form-filter/FormFilter";
import { Accordion, Button, Card } from "react-bootstrap";
import { CircleMinus, CirclePlus } from "lucide-react";
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
  const [activeKey, setActiveKey] = useState("0");
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
    listLoading: state.cpl_approval.listLoading,
    processLoading: state.cpl_approval.processLoading,
    consolidatedLoading: state.cpl_approval.consolidatedLoading,
    empWiseLoading: state.cpl_approval.empWiseLoading,
    pdf2Loading: state.cpl_approval.pdf2Loading,
    csvLoading: state.cpl_approval.csvLoading,
    excelLoading: state.cpl_approval.excelLoading,
    pdfLoading: state.cpl_approval.pdfLoading,
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
   
      <TCard name={CurrentModuleName()}>
        <Accordion activeKey={activeKey} onSelect={(key) => setActiveKey(key)}>
          <Card>
            <Card.Header className="d-flex justify-content-center">
              <div className="accordion-header-btn w-100  d-flex bg-tsecondary">
                <Accordion.Toggle
                  as={Button}
                  eventKey="0"
                  className="flex justify-start text-bold"
                >
                  {activeKey === "0" ? (
                    <CircleMinus className="h-4 w-4 text-black mr-1" />
                  ) : (
                    <CirclePlus className="h-4 w-4 text-black mr-1" />
                  )}
                  <span className="text-black">Filters</span>
                </Accordion.Toggle>
              </div>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <>
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
              </>
            </Accordion.Collapse>
          </Card>
        </Accordion>
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
