import {
  HeartHandshake,
  Plus,
  TrendingUpDown,
  NotebookTabs,
  Luggage,
  Receipt,
  BriefcaseBusiness,
  FileUser,
  PanelsTopLeft,
  FolderCheck,
  ListChecks,
  BanknoteArrowUp,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchModuleRights } from "../../../_redux/dashboardActions";

export const MenuOption = () => {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    moduleRights,
    attendance,
    payroll,
    interview_recommendations,
    requisition_job_vacancy,
    appraisalEval,
    appraisal,
    resignation,
    helpDesk,
    projectMgt,
    portalInfo,
    company_doc_portal,
    employee_task,
    budget,
  } = useSelector((state) => {
    return {
      moduleRights: state?.dashboard?.moduleRights,
      attendance: state?.auth?.userAccess["Attendance Management"],
      payroll: state?.auth?.userAccess["Payroll"],
      interview_recommendations:
        state?.auth?.userAccess?.["Interview Recommendations"],
      requisition_job_vacancy:
        state?.auth?.userAccess?.["Job Requisition Vacancy"],
      appraisalEval: state?.auth?.userAccess["appraisal_evaluation"],
      appraisal: state?.auth?.userAccess["Appraisal"],
      resignation: state?.auth?.userAccess["Resignation"],
      helpDesk: state?.auth?.userAccess["Help Desk"],
      projectMgt: state?.auth?.userAccess["Task"],
      company_doc_portal: state?.auth?.userAccess.company_doc_portal,
      portalInfo: state?.dashboard?.portalInfo,
      employee_task: state?.auth?.userAccess["Employee_Task"],
      budget: state?.auth?.userAccess["Budget"],
    };
  }, shallowEqual);

  useEffect(() => {
    dispatch(fetchModuleRights());
  }, []);

  const AttendanceRosterRequest = attendance?.find(
    (el) =>
      el?.componentName === "ReadAllAttendanceRosterRequest" &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );

  const TravelRequest = payroll?.find(
    (el) =>
      el?.componentName === "ReadAllTravelRequest" &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );
  const PostTravelRequest = payroll?.find(
    (el) =>
      el?.componentName === "ReadAllPostTravelRequest" &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );

  const claimRequest = payroll?.find(
    (el) =>
      el?.componentName === "ReadAllReimbursementClaimRequest" &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );

  const jobRequest = requisition_job_vacancy?.find(
    (el) =>
      el?.componentName === "ReadAllRequisitionJobVacancy" &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );

  const interviewRecomendation = interview_recommendations?.find(
    (el) =>
      el?.componentName === "ReadAllInterviewRecommendations" &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );

  const appraisalFeedbackSubmission = appraisalEval?.find(
    (el) =>
      el?.componentName === "ReadAllAppraisalEvaluation" &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );

  const appraisalGoalSetup = appraisal?.find(
    (el) =>
      el?.componentName === "ReadAllEmployeeGoalSetup" &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );

  const appraisalRatingFinal = appraisal?.find(
    (el) =>
      el?.componentName === "AppraisalReviewFinalization" &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );

  const resignRequest = resignation?.find(
    (el) =>
      el?.componentName === "ReadAllResignation" &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );

  const taskCreation = helpDesk?.find(
    (el) =>
      el?.componentName === "ReadAllFacilitatorTicketCreation" &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );

  const taskAssignmentTimeLine = helpDesk?.find(
    (el) =>
      el?.componentName === "ReadAllTaskAssignmentTimeline" &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );

  const ticketCreation = projectMgt?.find(
    (el) =>
      el?.componentName === "ReadAllTicketSetup" &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );

  const ticketTimeLog = projectMgt?.find(
    (el) =>
      el?.componentName === "ReadAllTimeLog" &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );

  const docSection = company_doc_portal?.find(
    (el) =>
      el?.componentName === "ReadAllCompanyDocPortal" &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );

  const employeeTaskItem = employee_task?.find(
    (el) =>
      el?.componentName === "ReadAllEmployeeTask" &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );

  const portalDepartmentWiseBudget = budget?.find(
    (el) =>
      el?.componentName === "ReadAllPortalDepartmentWiseBudget" &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );

  const MENUOPTION = useMemo(() => {
    return [
      {
        icon: <NotebookTabs className="w-6 h-6 text-black" />,
        name: "Roster",
        isShow:
          moduleRights?.find((e) => e?.value == 3)?.allow &&
          AttendanceRosterRequest,
        linkList: [
          {
            link:
              "/attendance_roster_request/read-all-attendance-roster-request",
            show: AttendanceRosterRequest,
            name: "Attendance Roster Request",
          },
        ],
      },
      {
        icon: <Luggage className="w-6 h-6 text-black" />,
        name: "Travel",
        isShow:
          moduleRights?.find((e) => e?.value == 4)?.allow &&
          (TravelRequest || PostTravelRequest),
        linkList: [
          {
            link: "/travel_request/read-all-travel-request",
            show: TravelRequest,
            name: "Travel Request",
          },
          {
            link: "/post_travel_request/read-all-post-travel-request",
            show: PostTravelRequest,
            name: "Post Travel Request",
          },
        ],
      },
      {
        icon: <Receipt className="w-6 h-6 text-black" />,
        name: "Reimbursement",
        isShow: moduleRights?.find((e) => e?.value == 4)?.allow && claimRequest,
        linkList: [
          {
            link:
              "/reimbursement_claim_request/read-all-reimbursement-claim-request",
            show: claimRequest,
            name: "Reimbursement Claim",
          },
        ],
      },
      {
        icon: <BriefcaseBusiness className="w-6 h-6 text-black" />,
        name: "Recruitement",
        isShow:
          moduleRights?.find((e) => e?.value == 5)?.allow &&
          (jobRequest || interviewRecomendation),
        linkList: [
          {
            link: "/requisition_job_vacancy/read-all-requisition-job-vacancy",
            show: jobRequest,
            name: "Job Vacancy Request",
          },
          {
            link:
              "/interview_recommendations/read-all-interview-recommendations",
            show: interviewRecomendation,
            name: "Interview Recommendations",
          },
        ],
      },
      {
        icon: <TrendingUpDown className="w-6 h-6 text-black" />,
        name: "Appraisal",
        isShow:
          moduleRights?.find((e) => e?.value == 6)?.allow &&
          (appraisalGoalSetup ||
            appraisalFeedbackSubmission ||
            appraisalRatingFinal),
        linkList: [
          {
            link: "/employee_goal_setup_portal/read-all-employee-goal-setup",
            show: appraisalGoalSetup,
            name: "Employee Goal Setup",
          },
          {
            link: "/appraisal_evaluation/read-all-appraisal-evaluation",
            show: appraisalFeedbackSubmission,
            name: "Submit Feedback",
          },
          {
            link: "/emp_appraisal/appraisal-review-finalization",
            show: appraisalRatingFinal,
            name: "Rating Finalization",
          },
        ],
      },
      {
        icon: <FileUser className="w-6 h-6 text-black" />,
        name: "Resignation",
        isShow:
          moduleRights?.find((e) => e?.value == "separation")?.allow &&
          resignRequest &&
          portalInfo?.allowResignationRequest,
        linkList: [
          {
            link: "/employee_resignation/read-all-resignation",
            show: resignRequest,
            name: "Request Resignation",
          },
        ],
      },
      {
        icon: <HeartHandshake className="w-6 h-6 text-black" />,
        name: "Help Desk",
        isShow:
          moduleRights?.find((e) => e?.value == 7)?.allow &&
          (taskCreation || taskAssignmentTimeLine),
        linkList: [
          {
            link:
              "/portal_ticket_creation/read-all-facilitator-ticket-creation",
            show: taskCreation,
            name: "Task Assignment",
          },
          {
            link:
              "/portal_task_assignment_timeline/read-all-task-assignment-timeline",
            show: taskAssignmentTimeLine,
            name: "Task Assignment Timeline",
          },
        ],
      },
      {
        icon: <PanelsTopLeft className="w-6 h-6 text-black" />,
        name: "Project Management",
        isShow:
          moduleRights?.find((e) => e?.value == 7)?.allow &&
          (ticketCreation || ticketTimeLog),
        linkList: [
          {
            link: "/ticket_setup_portal/read-all-ticket-setup",
            show: ticketCreation,
            name: "Ticket Creation",
          },
          {
            link: "/time_logging_portal/read-all-time-log",
            show: ticketTimeLog,
            name: "Time Logging",
          },
        ],
      },
      {
        icon: <FolderCheck className="w-6 h-6 text-black" />,
        name: "Documents",
        isShow: moduleRights?.find((e) => e?.value == 1)?.allow && docSection,
        linkList: [
          {
            link: "/company_doc_portal/read-all-company-doc-portal",
            show: docSection,
            name: "Company / My Documents",
          },
        ],
      },
      {
        icon: <ListChecks className="w-6 h-6 text-black" />,
        name: "Employee",
        isShow: employeeTaskItem,
        linkList: [
          {
            link: "/employee_task/read-all-employee-task",
            show: employeeTaskItem,
            name: "Checklist Task",
          },
        ],
      },
      {
        icon: <BanknoteArrowUp className="w-6 h-6 text-black" />,
        name: "Department Wise Budget",
        isShow: portalDepartmentWiseBudget,
        linkList: [
          {
            link:
              "/portal_department_wise_budget/read-all-portal-department-wise-budget",
            show: portalDepartmentWiseBudget,
            name: "Department Wise Budget",
          },
        ],
      },
    ];
  }, [moduleRights]);

  return (
    <div className="px-5 py-4 rounded-lg bg-white w-full relative">
      {/* Header section - clickable */}
      <div
        className="bg-tprimary px-4 py-2 flex justify-between items-center rounded-lg cursor-pointer transition-all duration-300 relative z-10"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h5 className="font-weight-bolder m-0 text-white py-1">
          Associated Modules
        </h5>
        <Plus
          className={`w-5 h-5 font-bold text-white transition-transform duration-300 ${
            isExpanded ? "rotate-45" : ""
          }`}
        />
      </div>

      {/* Expandable content section - absolute positioned */}
      <div
        className={`absolute left-0  w-full overflow-hidden transition-all duration-300 ease-in-out z-20 ${
          isExpanded
            ? "h-[30rem] opacity-100"
            : "h-0 opacity-0 pointer-events-none"
        }`}
        style={{ top: "calc(100% - 8px)" }}
      >
        <div className="bg-tprimary space-y-2 shadow-md rounded-lg p-4 mx-5 h-full overflow-y-auto scrollbar-fancy ">
          {/* Your content here */}
          {MENUOPTION?.filter((e) => e.isShow)?.map((el , i) => {
            return (
              <div key={i} className="bg-tsecondary shadow-md px-6 py-4 rounded-lg">
                <div className="flex items-center gap-3">
                  {el?.icon}
                  <div>
                    <h6 className="font-weight-bolder m-0 text-tprimary pb-1">
                      {el?.name}
                    </h6>
                    {el?.linkList
                      ?.filter((v) => v.show)
                      ?.map((vl, ind) => (
                        <div className="font-size-xs text-black font-bold">
                          <p className="m-0 underline">
                            <Link to={vl?.link}>{vl?.name} </Link>
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            );
          })}
          {/* Add more content as needed */}
        </div>
      </div>
    </div>
  );
};
