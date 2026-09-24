import React from "react";
import { ToastContainer } from "react-toastify";
import { Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import { TaskAssignmentTimelineUIProvider } from "./FormUIContext";
import { FormCard } from "./form-card/FormCard";
import EmployeePortalMenu from "../../../../utils/common-modules/EmployeePortalMenu";
import EmployeeProfile from "../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";
import CurrentModuleName from "../../../../utils/common-modules/ModuleName";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { DetailData } from "./modal/DetailData";
import { DetailTimeLog } from "./modal/DetailTimeLog";
import { FormUIProvider } from "../../../FacilitatorTicketCreation/pages/facilitatorTicketCreation/FormUIContext";


import { TimeLog } from "./modal/TimeLog";
export function FormPage({ history }) {

    const { report,calendar,portal_ticket_creation} = useSelector((state) => {
      return {
  
        report: state?.auth?.userAccess["portal_ticket_time_report"],
        calendar: state?.auth?.userAccess["portal_ticket_calendar"],
        portal_ticket_creation: state?.auth?.userAccess["portal_ticket_creation"],
        
      };
    }, shallowEqual);

      const taskAssignmentTimelineUIEvents = {
    openDetailGridData: (masterId) => {
      history.push(
        `/portal_task_assignment_timeline/read-all-task-assignment-timeline/${masterId}/detail`
      );
    },
    openDetailTimeLog: (detailId) => {
      history.push(
        `/portal_task_assignment_timeline/read-all-task-assignment-timeline/${detailId}/detailtimelog`
      );
    },
            openTicketTimeLog: (detailId, isUserRead) => {
      history.push(`/task_assignment_timeline/read-all-task-assignment-timeline/${detailId}/timelog`);
    },
    addNewTicket: () => {
      window.open(
        "/portal_ticket_creation/read-all-facilitator-ticket-creation",
        "_blank"
      );
    },
  };

     const facilitatorFormUIEvents = {
    openDetailGridData: () => {},
    openDetailTimeLog: () => {},
    openTicketTimeLog: () => {},
    newFormButtonClick: () => {},
    openEditFormDialog: () => {},
    openDeleteFormDialog: () => {},
    openActiveFormDialog: () => {},
    openReadFormDialog: () => {},
    openReceiveFormDialog: () => {},
  };
  return (
    <TaskAssignmentTimelineUIProvider
       taskAssignmentTimelineUIEvents={taskAssignmentTimelineUIEvents}
    >
      {/* Task Assignment Timeline List / Card */}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">

        {/* <div className="px-1 md:mb-0 md:col-span-1 xl:col-span-3 flex flex-col gap-4">
          <div className="xl:hidden block">
            <EmployeePortalMenu
              name={CurrentModuleName()}
              isBackButton={true}
              isDashboardRedirect={true}
                   menuOptions={[
              {
                name: "Task Assignment",
                link: "/portal_ticket_creation/read-all-facilitator-ticket-creation",
                isShow: portal_ticket_creation?.find(
                  (el) =>
                    el?.componentName === "ReadFacilitatorTicketCreation"
                ),
              }, 
              
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
          <EmployeeProfile />
        </div> */}
        <div className="md:col-span-1 xl:col-span-12 flex flex-col gap-4">
          <div className="hidden xl:block ">
            <EmployeePortalMenu
              name={CurrentModuleName()}
              isBackButton={true}
              isDashboardRedirect={true}
                    menuOptions={[
              {
                name: "Task Assignment",
                link: "/portal_ticket_creation/read-all-facilitator-ticket-creation",
                isShow: portal_ticket_creation?.find(
                  (el) =>
                    el?.componentName === "ReadFacilitatorTicketCreation"
                ),
              }, 
              
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

     {/* Detail modal route */}
        <Route path="/portal_task_assignment_timeline/read-all-task-assignment-timeline/:masterId/detail">
          {({ history, match }) => (
            <DetailData
              show={match != null}
              detailId={match && match.params.masterId}
              onHide={() =>
                history.push("/portal_task_assignment_timeline/read-all-task-assignment-timeline")
              }
            />
          )}
        </Route>
  
        {/* Detail Time Log modal route */}
        {/* <Route path="/portal_task_assignment_timeline/read-all-task-assignment-timeline/:detailId/detailtimelog">
          {({ history, match }) => (
            <FormUIProvider FormUIEvents={facilitatorFormUIEvents}>
              <DetailTimeLog
                show={match != null}
                detailId={match && match.params.detailId}
                onHide={() =>
                  history.push("/portal_task_assignment_timeline/read-all-task-assignment-timeline")
                }
              />
            </FormUIProvider>
          )}
        </Route> */}

           <Route path="/portal_task_assignment_timeline/read-all-task-assignment-timeline/:detailId/timelog">
                {({ history, match }) => (
                  <TimeLog
                    show={match != null}
                    detailId={match && match.params.detailId}
                    status={match && match.params.status}
                    onHide={() => {
                      history.push("/task_assignment_timeline/read-all-task-assignment-timeline");
                    }}
                  />
                )}
              </Route>
  
  <Route path="/portal_task_assignment_timeline/read-all-task-assignment-timeline/:detailId/detailtimelog">
    {({ history, match }) => {
      const show = match != null;
      const detailId = match?.params.detailId;
  
      return (
        <DetailTimeLog
          show={show}
          detailId={detailId}
          onHide={() =>
            history.push("/portal_task_assignment_timeline/read-all-task-assignment-timeline")
          }
        />
      );
    }}
  </Route>
  


          <FormCard />
        </div>
        </div>

      </div>

      {/* Optional Toast notifications */}
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
    </TaskAssignmentTimelineUIProvider>
  );
}