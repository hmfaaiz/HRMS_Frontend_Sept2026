import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormTable } from "./form-table/FormTable";
import { FormFilter } from "./form-filter/FormFilter";
import {
  fetchAllDept,
  fetchAllFormsMenu,
  fetchAllSubsidiaryData,
} from "../../../../../_metronic/redux/dashboardActions";
import { useSelector, useDispatch } from "react-redux";
import { FormUIProvider } from "./FormUIContext";
import CurrentModuleName from "../../../../utils/common-modules/ModuleName";
import TCard from "../../../../utils/common-modules/TCard";
import { Accordion, Button, Card } from "react-bootstrap";
import { CircleMinus, CirclePlus } from "lucide-react";

export function LeaveRegisterPage() {
  const dispatch = useDispatch();
    const [activeKey, setActiveKey] = useState("0");
  const { dashboard, listLoading, pdfLoading } = useSelector((state) => ({
    dashboard: state.dashboard,
    listLoading: state.leave_register.listLoading,
    pdfLoading: state.leave_register.pdfLoading,
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
      {/* <Card> */}
      {/* Card Starts */}

      {/* <CardHeader title={CurrentModuleName()}></CardHeader> */}

      {/* Filter Form Starts */}
      {/* <FormFilter
          loading={listLoading}
          pdfLoading={pdfLoading}
          dispatch={dispatch}
        /> */}
      {/* Filter Form Ends */}

      {/* Table Starts */}
      {/* <FormTable /> */}
      {/* Table Ends */}

      {/* Card Ends */}
      {/* </Card> */}
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
            loading={listLoading}
            pdfLoading={pdfLoading}
            dispatch={dispatch}
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
