import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormCard } from "./form-card/FormCard";
import EmployeeProfile from "../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";
import EmployeePortalMenu from "../../../../utils/common-modules/EmployeePortalMenu";
import CurrentModuleName from "../../../../utils/common-modules/ModuleName";
import { useSelector, useDispatch,shallowEqual  } from "react-redux";




export function FormPage({ }) {

      const { report,calendar,portal_ticket_creation,portal_task_assignment_timeline} = useSelector((state) => {
      return {
  
        report: state?.auth?.userAccess["portal_ticket_time_report"],
        portal_ticket_creation: state?.auth?.userAccess["portal_ticket_creation"],
        portal_task_assignment_timeline: state?.auth?.userAccess["portal_task_assignment_timeline"],
        
      };
    }, shallowEqual);

  return (

    <>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* <div className="px-1 md:mb-0 md:col-span-1 xl:col-span-3 flex flex-col gap-4">
          <div className="xl:hidden block">
            <EmployeePortalMenu
              name={CurrentModuleName()}
              isBackButton={true}
              isDashboardRedirect={true}
                    menuOptions={[

                       {
                  name: "Task Assignment Timeline",
                  link: "/portal_task_assignment_timeline/read-all-task-assignment-timeline",
                  isShow: portal_task_assignment_timeline?.find(
                    (el) =>
                      el?.componentName === "ReadTaskAssignmentTimeline"
                  ),
                },
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
                  name: "Task Assignment Timeline",
                  link: "/portal_task_assignment_timeline/read-all-task-assignment-timeline",
                  isShow: portal_task_assignment_timeline?.find(
                    (el) =>
                      el?.componentName === "ReadTaskAssignmentTimeline"
                  ),
                },
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

              ]}
              isDashboardIcon={true}
            />
          </div>
          <div className="px-3 py-2 rounded-lg bg-white">
            <FormCard />
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
    </>
  );
}
