import React, { useEffect, useMemo, useState } from "react";


import { FormTable } from "../form-table/FormTable";
import { useFormUIContext } from "../FormUIContext";

import { useSelector, shallowEqual, useDispatch } from "react-redux";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import TCard from "../../../../../utils/common-modules/TCard";
import EmployeeProfile from "../../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";

import { FormEditDialog } from "../form-edit-dialog/FormEditDialog";
import { fetchAllActiveEmployees } from "../../../../../../_metronic/redux/dashboardActions";
import { ResponseTable } from "../form-table/ResponseTable";
import { Accordion, Button, Card } from "react-bootstrap";
import { CircleMinus, CirclePlus } from "lucide-react";
import { FormFIlter } from "../form-filter/FormFIlter";
import { ReceiveFIlter } from "../form-filter/ReceiveFilter";
import EmployeePortalMenu from "../../../../../utils/common-modules/EmployeePortalMenu";
export function FormCard() {
  const FormUIContext = useFormUIContext();
  const dispatch = useDispatch();
  const [activeKey, setActiveKey] = useState(null);
  const FormUIProps = useMemo(() => {
    return {
      newFormButtonClick: FormUIContext.newFormButtonClick,
      openEditFormDialog: FormUIContext.openEditFormDialog,
      setemployeeId: FormUIContext.setemployeeId,
      id: FormUIContext.ids,
      employeeId: FormUIContext.employeeId,
      panelMode: FormUIContext.panelMode,
      setPanelMode: FormUIContext.setPanelMode,
      readMode: FormUIContext.readMode,
      setReadMode: FormUIContext.setReadMode,
    };
  }, [FormUIContext]);

  const { userAccess, dashboard } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.facilitator_ticket_creation,
      dashboard: state.dashboard,
    }),
    shallowEqual
  );

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateTicketCreation"
  );

  const { currentState ,report,calendar} = useSelector((state) => {
    return {
      currentState: state.portal_ticket_creation,
      userAccess: state?.auth?.userAccess["facilitator_ticket_creation"],
      report: state?.auth?.userAccess["portal_ticket_time_report"],
      calendar: state?.auth?.userAccess["portal_ticket_calendar"],
    };
  }, shallowEqual);

  useEffect(() => {
    if (!dashboard.employee || !dashboard.employee.length)
      dispatch(fetchAllActiveEmployees());
  }, [dispatch, FormUIProps.employeeId]);

  const { entities } = currentState;

  return (

    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
      <div className="px-1 md:mb-0 md:col-span-1 xl:col-span-3 flex flex-col gap-4">
        <div className="xl:hidden block">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            isBackButton={true}
            isDashboardRedirect={true}
            menuOptions={[

            ]}
            isDashboardIcon={true}
          />
        </div>
        <EmployeeProfile />
      </div>

      <div className="md:col-span-1 xl:col-span-9 flex flex-col gap-4">
        <div className="hidden xl:block ">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            isBackButton={true}
            isDashboardRedirect={true}
              menuOptions={[
              {
                name: "Report",
                link: "/portal_ticket_time_report/read-all-project-report",
                isShow: report?.find(
                  (el) =>
                    el?.componentName === "ReadAllAssignmentReport"
                ),
              },
              {
                name: "Calendar",
                link: "/portal_ticket_calendar/read-ticket-calendar",
                isShow: calendar?.find(
                  (el) =>
                    el?.componentName === "ReadTicketCalendar"
                ),
              },
       
            ]}
            isDashboardIcon={true}
          />
        </div>



        <div className="px-3 py-2 rounded-lg bg-white">


          <div>



            <h6 className="font-bold mb-0 text-primary my-2">
              Ticket (Receive)
            </h6>

            <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>

              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "red",
                    display: "inline-block",
                  }}
                ></span>
                <span>High</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "orange",
                    display: "inline-block",
                  }}
                ></span>
                <span>Medium</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "green",
                    display: "inline-block",
                  }}
                ></span>
                <span>Low</span>
              </div>

            </div>


            <div >
              <Accordion activeKey={activeKey} onSelect={(key) => setActiveKey(key)} >
                <Card>
                  <Card.Header className="d-flex justify-content-center">
                    <div className="accordion-header-btn w-100  d-flex bg-tsecondary">
                      <Accordion.Toggle
                        as={Button}
                        eventKey="0"
                        className="flex justify-start text-bold"
                      >

                        {activeKey === "0" ? <CircleMinus className="h-4 w-4 text-black mr-1" /> : <CirclePlus className="h-4 w-4 text-black mr-1" />}<span className="text-black">Filters</span>

                      </Accordion.Toggle>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">

                    <>
                      <ReceiveFIlter />
                    </>

                  </Accordion.Collapse>
                </Card>
              </Accordion>
            </div>


            <ResponseTable />



            <h6 className="font-bold mb-0 text-primary my-2">
              Ticket Detail
            </h6>

            <FormEditDialog id={FormUIProps.id} employeeId={FormUIProps.employeeId} />





            <h6 className="font-bold mb-0 text-primary my-2">
              Ticket (Send)
            </h6>

            <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>

              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "red",
                    display: "inline-block",
                  }}
                ></span>
                <span>High</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "orange",
                    display: "inline-block",
                  }}
                ></span>
                <span>Medium</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "green",
                    display: "inline-block",
                  }}
                ></span>
                <span>Low</span>
              </div>

            </div>


            <div >
              <Accordion activeKey={activeKey} onSelect={(key) => setActiveKey(key)} >
                <Card>
                  <Card.Header className="d-flex justify-content-center">
                    <div className="accordion-header-btn w-100  d-flex bg-tsecondary">
                      <Accordion.Toggle
                        as={Button}
                        eventKey="0"
                        className="flex justify-start text-bold"
                      >

                        {activeKey === "0" ? <CircleMinus className="h-4 w-4 text-black mr-1" /> : <CirclePlus className="h-4 w-4 text-black mr-1" />}<span className="text-black">Filters</span>

                      </Accordion.Toggle>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">

                    <>
                      <FormFIlter />
                    </>

                  </Accordion.Collapse>
                </Card>
              </Accordion>
            </div>
            <FormTable />
          </div>
        </div>
      </div>
    </div>

  );


}
