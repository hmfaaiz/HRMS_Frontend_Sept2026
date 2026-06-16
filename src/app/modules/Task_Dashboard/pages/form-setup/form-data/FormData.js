import React, { useMemo, useState } from "react";
import { Clock10, TicketCheck, TicketMinus, TicketPlus } from "lucide-react";
import StatsCard from "./StatsCard";
import TableModel from "./TableModel";
import { TableData } from "./TableData";
import DonutChart from "./DonutChart";
import MultiRowProgressChart from "./MultiRowProgressChart";

export default FormData = ({
  data,
  isProject,
  actionsLoading,
  isTask,
  projectVisibleSections = [],
  taskVisibleSections = [],
}) => {
  const [modalData, setModalData] = useState(null);

  // Determines which module to navigate to when a ticket code is clicked
  const ticketCodeRoute = isProject
    ? "/project_timeline/read-all-project-timeline"
    : "/task_assignment_timeline/read-all-task-assignment-timeline";
  const projectSectionSet = useMemo(() => new Set(projectVisibleSections), [
    projectVisibleSections,
  ]);
  const taskSectionSet = useMemo(() => new Set(taskVisibleSections), [
    taskVisibleSections,
  ]);
  const showProjectSection = (key) => projectSectionSet.has(key);
  const showTaskSection = (key) => taskSectionSet.has(key);
  return (
    <>
      {!actionsLoading ? (
        <>
          {isProject ? (
            <>
              <div className="px-3 py-2 rounded-lg bg-white mt-2">
                <div className="grid grid-cols-6 gap-x-2 gap-y-1">
                  <StatsCard
                    icon={<TicketPlus className="w-5 h-5 text-white" />}
                    name={"Created Tickets"}
                    value={data?.totalCreated?.count}
                    handleCardClick={() => {
                      setModalData({
                        name: "Created Tickets",
                        data:
                          data?.totalCreated?.rows?.map((el) => ({
                            ticket_Code: el?.ticketCode,
                            Ticket_Status: el?.TicketStatus?.statusName,
                            start_Date: el?.startDate || "-",
                            due_Date: el?.dueDate || "-",
                            Report_To: el?.ReportToEmp?.name || "-",
                            Assign_To: el?.AssignToEmp?.name || "-",
                          })) || [],
                      });
                    }}
                  />
                  <StatsCard
                    icon={<TicketCheck className="w-5 h-5 text-white" />}
                    name={"Completed Tickets"}
                    value={data?.totalCompleted?.count}
                    handleCardClick={() => {
                      setModalData({
                        name: "Completed Tickets",
                        data:
                          data?.totalCompleted?.rows?.map((el) => ({
                            ticket_Code: el?.ticketCode,
                            Ticket_Status: el?.TicketStatus?.statusName,
                            start_Date: el?.startDate || "-",
                            due_Date: el?.dueDate || "-",
                            Report_To: el?.ReportToEmp?.name || "-",
                            Assign_To: el?.AssignToEmp?.name || "-",
                          })) || [],
                      });
                    }}
                  />
                  <StatsCard
                    icon={<TicketMinus className="w-5 h-5 text-white" />}
                    name={"Overdue Tickets"}
                    value={data?.totalOverDue?.count}
                    handleCardClick={() => {
                      setModalData({
                        name: "Overdue Tickets",
                        data:
                          data?.totalOverDue?.rows?.map((el) => ({
                            ticket_Code: el?.ticketCode,
                            Ticket_Status: el?.TicketStatus?.statusName,
                            start_Date: el?.startDate || "-",
                            due_Date: el?.dueDate || "-",
                            Report_To: el?.ReportToEmp?.name || "-",
                            Assign_To: el?.AssignToEmp?.name || "-",
                          })) || [],
                      });
                    }}
                  />
                  <StatsCard
                    icon={<Clock10 className="w-5 h-5 text-white" />}
                    name={"Time Logged on Project"}
                    value={data?.totalHours?.count}
                    handleCardClick={() => {
                      setModalData({
                        name: "Time Logged on Project",
                        data:
                          data?.totalHours?.rows?.map((el) => ({
                            ticket_Code: el?.Ticket?.ticketCode,
                            ticket_Summary: el?.Ticket?.ticketSummary,
                            Employee: el?.Employee?.name,
                            logged_Hours: el?.noOfHours || "-",
                            logged_Date: el?.loggedDate || "-",
                          })) || [],
                      });
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {showProjectSection("recent_activity_date_wise") ? (
                  <TableData
                    completeData={data?.recentActivity}
                    data={data?.recentActivity?.map((el) => ({
                      Date: new Date(el?.["updatedAt"])?.toDateString() || "-",
                      ticket_Code: el?.ticketCode,
                      Ticket_Status: el?.["TicketStatus.statusName"] || "-",
                      start_Date: el?.startDate || "-",
                      due_Date: el?.dueDate || "-",
                      Report_To: el?.["ReportToEmp.name"] || "-",
                      Assign_To: el?.["AssignToEmp.name"] || "-",
                    }))}
                    name={"Recent Activity - Date Wise"}
                    ticketCodeRoute={ticketCodeRoute}
                    handleClick={(e, completeData) =>
                      setModalData({
                        name: "Recent Activity - Date Wise",
                        data: e,
                        completeData,
                      })
                    }
                    columnColorRules={{
                      Ticket_Status: (value, row, data) => {
                        let statusId = data?.find(
                          (el) => el?.ticketCode == row?.ticket_Code,
                        )?.["TicketStatus.statusId"];
                        if (statusId == 614) {
                          return { color: "#000000", fontWeight: "bold" };
                        } else if (statusId == 615) {
                          return { color: "#0093DD", fontWeight: "bold" };
                        } else if (statusId == 616) {
                          return { color: "#34b9a3", fontWeight: "bold" };
                        }
                        return "black";
                      },
                    }}
                  />
                ) : null}
                {showProjectSection("employee_wise_ticket_status_overview") ? (
                  <TableData
                    completeData={data?.employeeWiseTicketStatus}
                    data={data?.employeeWiseTicketStatus?.map((el) => ({
                      Assign_To: el?.Assign_To || "-",
                      Total: el?.Total || "-",
                      To_Do: el?.To_Do || "-",
                      In_Progress: el?.In_Progress || "-",
                      Done: el?.Done || "-",
                    }))}
                    name={"Employee Wise Ticket Status Wise Overview"}
                    ticketCodeRoute={ticketCodeRoute}
                    handleClick={(e, completeData) =>
                      setModalData({
                        name: "Employee Wise Ticket Status Wise Overview",
                        data: e,
                        completeData,
                      })
                    }
                  />
                ) : null}
                {showProjectSection("overdue_tickets") ? (
                  <TableData
                    completeData={data?.overdueTickets}
                    data={data?.overdueTickets?.map((el) => ({
                      ...el,
                    }))}
                    name={"Overdue Tickets"}
                    ticketCodeRoute={ticketCodeRoute}
                    handleClick={(e, completeData) =>
                      setModalData({
                        name: "Overdue Tickets",
                        data: e,
                        completeData,
                      })
                    }
                    columnColorRules={{
                      Priority: (value) => {
                        if (value == "High") {
                          return { color: "#e23f35", fontWeight: "bold" };
                        } else if (value == "Medium") {
                          return { color: "#dd8941", fontWeight: "semibold" };
                        } else if (value == "Low") {
                          return { color: "#34b9a3", fontWeight: "normal" };
                        }
                        return "black";
                      },
                    }}
                  />
                ) : null}
                {showProjectSection("ticket_wise_time_log") ? (
                  <TableData
                    completeData={data?.ticketWiseTimeLog}
                    data={data?.ticketWiseTimeLog?.map(
                      ({ ticketId, statusId, ...rest }) => ({
                        ...rest,
                      }),
                    )}
                    name={"Tickets Wise Time Log"}
                    ticketCodeRoute={ticketCodeRoute}
                    handleClick={(e, completeData) =>
                      setModalData({
                        name: "Tickets Wise Time Log",
                        data: e,
                        completeData,
                      })
                    }
                    columnColorRules={{
                      Logged_Hours: (value, row) => {
                        if (Number(value) > Number(row?.Estimated_Hours))
                          return { color: "#e23f35", fontWeight: "bold" };
                        return "black";
                      },
                      Ticket_Status: (value, row, data) => {
                        let statusId = data?.find(
                          (el) => el?.Ticket_Code == row?.Ticket_Code,
                        )?.statusId;
                        if (statusId == 614) {
                          return { color: "#000000", fontWeight: "bold" };
                        } else if (statusId == 615) {
                          return { color: "#0093DD", fontWeight: "bold" };
                        } else if (statusId == 616) {
                          return { color: "#34b9a3", fontWeight: "bold" };
                        }
                        return "black";
                      },
                    }}
                  />
                ) : null}
                {showProjectSection("employee_wise_time_log") ? (
                  <TableData
                    completeData={data?.employeeWiseTimeLog}
                    data={data?.employeeWiseTimeLog?.map(
                      ({ employeeId, ...rest }) => ({
                        ...rest,
                      }),
                    )}
                    name={"Employee Wise Time Log"}
                    ticketCodeRoute={ticketCodeRoute}
                    handleClick={(e, completeData) =>
                      setModalData({
                        name: "Employee Wise Time Log",
                        data: e,
                        completeData,
                      })
                    }
                  />
                ) : null}
                {showProjectSection("employee_ticket_wise_time_log") ? (
                  <TableData
                    completeData={data?.ticketEmployeeWiseTimeLog}
                    data={data?.ticketEmployeeWiseTimeLog?.map(
                      ({ employeeId, ticketId, statusId, ...rest }) => ({
                        ...rest,
                      }),
                    )}
                    name={"Employee Ticket Wise Time Log"}
                    ticketCodeRoute={ticketCodeRoute}
                    handleClick={(e, completeData) =>
                      setModalData({
                        name: "Employee Ticket Wise Time Log",
                        data: e,
                        completeData,
                      })
                    }
                    columnColorRules={{
                      Logged_Hours: (value, row) => {
                        if (Number(value) > Number(row?.Estimated_Hours))
                          return { color: "#e23f35", fontWeight: "bold" };
                        return "black";
                      },
                      Ticket_Status: (value, row, data) => {
                        let statusId = data?.find(
                          (el) => el?.Ticket_Code == row?.Ticket_Code,
                        )?.statusId;
                        if (statusId == 614) {
                          return { color: "#000000", fontWeight: "bold" };
                        } else if (statusId == 615) {
                          return { color: "#0093DD", fontWeight: "bold" };
                        } else if (statusId == 616) {
                          return { color: "#34b9a3", fontWeight: "bold" };
                        }
                        return "black";
                      },
                    }}
                  />
                ) : null}
                {showProjectSection("pending_in_progress_ticket_time_log") ? (
                  <TableData
                    completeData={data?.pendingInPorgressTicketWiseTimeLog}
                    data={data?.pendingInPorgressTicketWiseTimeLog?.map(
                      ({ ticketId, statusId, ...rest }) => ({
                        ...rest,
                      }),
                    )}
                    name={"Pending In Progress Ticket Time Log"}
                    ticketCodeRoute={ticketCodeRoute}
                    handleClick={(e, completeData) =>
                      setModalData({
                        name: "Pending In Progress Ticket Time Log",
                        data: e,
                        completeData,
                      })
                    }
                    columnColorRules={{
                      Logged_Hours: (value, row) => {
                        if (Number(value) > Number(row?.Estimated_Hours))
                          return { color: "#e23f35", fontWeight: "bold" };
                        return "black";
                      },
                      Ticket_Status: (value, row, data) => {
                        let statusId = data?.find(
                          (el) => el?.Ticket_Code == row?.Ticket_Code,
                        )?.statusId;
                        if (statusId == 614) {
                          return { color: "#000000", fontWeight: "bold" };
                        } else if (statusId == 615) {
                          return { color: "#0093DD", fontWeight: "bold" };
                        } else if (statusId == 616) {
                          return { color: "#34b9a3", fontWeight: "bold" };
                        }
                        return "black";
                      },
                    }}
                  />
                ) : null}
                {showProjectSection("completed_ticket_time_log") ? (
                  <TableData
                    completeData={data?.completedTicketWiseTimeLog}
                    data={data?.completedTicketWiseTimeLog?.map(
                      ({ ticketId, statusId, ...rest }) => ({
                        ...rest,
                      }),
                    )}
                    name={"Completed Ticket Time Log"}
                    ticketCodeRoute={ticketCodeRoute}
                    handleClick={(e, completeData) =>
                      setModalData({
                        name: "Completed Ticket Time Log",
                        data: e,
                        completeData,
                      })
                    }
                    columnColorRules={{
                      Logged_Hours: (value, row) => {
                        if (Number(value) > Number(row?.Estimated_Hours))
                          return { color: "#e23f35", fontWeight: "bold" };
                        return "black";
                      },
                    }}
                  />
                ) : null}
                {showProjectSection("ticket_status_overview") ? (
                  <DonutChart
                    data={data?.ticketStatusOverview}
                    name={"Ticket Status Overview"}
                  />
                ) : null}
                {showProjectSection("ticket_type_wise_overview") ? (
                  <MultiRowProgressChart
                    data={data?.ticketTypeOverview}
                    heading="Ticket Type Wise Overview"
                  />
                ) : null}
                {showProjectSection("priority_status_overview") ? (
                  <DonutChart
                    data={data?.priorityStatusOverview}
                    name={"Priority Status Overview"}
                  />
                ) : null}
                {showProjectSection("employee_wise_overview") ? (
                  <MultiRowProgressChart
                    data={data?.employeeWiseTicketType?.map((el) => ({
                      ...el,
                      value: el?.No_of_Tasks,
                      label: el?.Assign_To,
                    }))}
                    heading="Employee Wise Overview"
                  />
                ) : null}
              </div>
            </>
          ) : isTask ? (
            <>
              <div className="px-3 py-2 rounded-lg bg-white mt-2">
                <div className="grid grid-cols-6 gap-x-2 gap-y-1">
                  <StatsCard
                    icon={<TicketPlus className="w-5 h-5 text-white" />}
                    name={"Created Task"}
                    value={data?.totalCreated?.count}
                    handleCardClick={() => {
                      setModalData({
                        name: "Created Task",
                        data:
                          data?.totalCreated?.rows?.map((el) => ({
                            ticket_Code: el?.ticketCode,
                            ticket_Description: el?.ticketDescription,
                            Employee: el?.EmployeeProfile?.name,
                            priority: el?.priorityLevel?.formName || "-",
                          })) || [],
                      });
                    }}
                  />
                  <StatsCard
                    icon={<TicketCheck className="w-5 h-5 text-white" />}
                    name={"Completed Task"}
                    value={data?.totalCompleted?.count}
                    handleCardClick={() => {
                      setModalData({
                        name: "Completed Task",
                        data:
                          data?.totalCompleted?.rows?.map((el) => ({
                            ticket_Code: el?.ticketCode,
                            ticket_Description: el?.ticketDescription,
                            Employee: el?.EmployeeProfile?.name,
                            priority: el?.priorityLevel?.formName || "-",
                          })) || [],
                      });
                    }}
                  />
                  <StatsCard
                    icon={<TicketMinus className="w-5 h-5 text-white" />}
                    name={"Overdue Task"}
                    value={data?.totalOverDue?.count}
                    handleCardClick={() => {
                      setModalData({
                        name: "Overdue Task",
                        data:
                          data?.totalOverDue?.rows?.map((el) => ({
                            ticket_Code: el?.ticketCode,
                            ticket_Description: el?.ticketDescription,
                            Employee: el?.EmployeeProfile?.name,
                            priority: el?.priorityLevel?.formName || "-",
                            due_Date: el?.dueDate || "-",
                          })) || [],
                      });
                    }}
                  />
                  <StatsCard
                    icon={<Clock10 className="w-5 h-5 text-white" />}
                    name={"Time Logged on Task"}
                    value={data?.totalHours?.count}
                    handleCardClick={() => {
                      setModalData({
                        name: "Time Logged on Task",
                        data:
                          data?.totalHours?.rows?.map((el) => ({
                            ticket_Code: el?.MasterDetailTimeLog?.ticketCode,
                            ticket_Description:
                              el?.MasterDetailTimeLog?.ticketDescription,
                            Employee: el?.LoggedByProfile?.name,
                            logged_Hours: el?.noOfHours || "-",
                            logged_Date: el?.loggedDate || "-",
                          })) || [],
                      });
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {showTaskSection("recent_activity_date_wise") ? (
                  <TableData
                    completeData={data?.recentActivity}
                    data={data?.recentActivity?.map((el) => ({
                      Date: new Date(el?.["updatedAt"])?.toDateString() || "-",
                      ticket_Code: el?.ticketCode,
                      ticket_Description: el?.ticketDescription,
                      Priority: el?.["priorityLevel.formName"] || "-",
                      Employee: el?.["EmployeeProfile.name"] || "-",
                    }))}
                    columnColorRules={{
                      Priority: (value) => {
                        if (value == "High") {
                          return { color: "#e23f35", fontWeight: "bold" };
                        } else if (value == "Medium") {
                          return { color: "#dd8941", fontWeight: "semibold" };
                        } else if (value == "Low") {
                          return { color: "#34b9a3", fontWeight: "normal" };
                        }
                        return "black";
                      },
                    }}
                    name={"Recent Activity - Date Wise"}
                    ticketCodeRoute={ticketCodeRoute}
                    handleClick={(e, completeData) =>
                      setModalData({
                        name: "Recent Activity - Date Wise",
                        data: e,
                        completeData,
                      })
                    }
                  />
                ) : null}
                {showTaskSection("employee_wise_task_status_overview") ? (
                  <TableData
                    completeData={data?.employeeWiseTicketStatus}
                    data={data?.employeeWiseTicketStatus?.map((el) => ({
                      ticket_Code: el?.ticketCode,
                      ticket_Description: el?.ticketDescription,
                      Assign_To: el?.Assign_To || "-",
                      Ticket_Status: el?.Ticket_Status || "-",
                      No_of_Tasks: el?.No_of_Tasks || "-",
                    }))}
                    name={"Employee Wise Task Status Overview"}
                    ticketCodeRoute={ticketCodeRoute}
                    handleClick={(e, completeData) =>
                      setModalData({
                        name: "Employee Wise Task Status Overview",
                        data: e,
                        completeData,
                      })
                    }
                  />
                ) : null}
                {showTaskSection("overdue_task") ? (
                  <TableData
                    completeData={data?.overDueTask}
                    data={data?.overDueTask?.map((el) => ({
                      ...el,
                    }))}
                    columnColorRules={{
                      Priority: (value) => {
                        if (value == "High") {
                          return { color: "#e23f35", fontWeight: "bold" };
                        } else if (value == "Medium") {
                          return { color: "#dd8941", fontWeight: "semibold" };
                        } else if (value == "Low") {
                          return { color: "#34b9a3", fontWeight: "normal" };
                        }
                        return "black";
                      },
                    }}
                    name={"Overdue Task"}
                    ticketCodeRoute={ticketCodeRoute}
                    handleClick={(e, completeData) =>
                      setModalData({
                        name: "Overdue Task",
                        data: e,
                        completeData,
                      })
                    }
                  />
                ) : null}
                {showTaskSection("task_wise_time_log") ? (
                  <TableData
                    completeData={data?.ticketWiseTimeLog}
                    data={data?.ticketWiseTimeLog?.map(
                      ({
                        ticketTypeId,
                        masterId,
                        Ticket_Status,
                        Logging_Status,
                        ...rest
                      }) => ({
                        ...rest,
                        Ticket_Status: `${Ticket_Status} ${
                          Logging_Status ? `(${Logging_Status})` : ""
                        }`,
                      }),
                    )}
                    name={"Task Wise Time Log"}
                    ticketCodeRoute={ticketCodeRoute}
                    handleClick={(e, completeData) =>
                      setModalData({
                        name: "Task Wise Time Log",
                        data: e,
                        completeData,
                      })
                    }
                    columnColorRules={{
                      Logged_Hours: (value, row) => {
                        if (Number(value) > Number(row?.Estimated_Hours))
                          return { color: "#e23f35", fontWeight: "bold" };
                        return "black";
                      },
                      Ticket_Status: (value) => {
                        if (value == "Open (Overdue)") {
                          return { color: "#e23f35", fontWeight: "bold" };
                        }
                        return "black";
                      },
                    }}
                  />
                ) : null}
                {showTaskSection("employee_wise_time_log") ? (
                  <TableData
                    completeData={data?.employeeWiseTimeLog}
                    data={data?.employeeWiseTimeLog?.map(
                      ({ ticketTypeId, loggedByEmpId, ...rest }) => ({
                        ...rest,
                      }),
                    )}
                    name={"Employee Wise Time Log"}
                    ticketCodeRoute={ticketCodeRoute}
                    handleClick={(e, completeData) =>
                      setModalData({
                        name: "Employee Wise Time Log",
                        data: e,
                        completeData,
                      })
                    }
                  />
                ) : null}
                {showTaskSection("employee_task_wise_time_log") ? (
                  <TableData
                    completeData={data?.ticketEmployeeWiseTimeLog}
                    data={data?.ticketEmployeeWiseTimeLog?.map(
                      ({ ticketTypeId, masterId, LoggedByEmpId, ...rest }) => ({
                        ...rest,
                      }),
                    )}
                    name={"Employee Task Wise Time Log"}
                    ticketCodeRoute={ticketCodeRoute}
                    columnColorRules={{
                      Logged_Hours: (value, row) => {
                        if (Number(value) > Number(row?.Estimated_Hours))
                          return { color: "#e23f35", fontWeight: "bold" };
                        return "black";
                      },
                    }}
                    handleClick={(e, completeData) =>
                      setModalData({
                        name: "Employee Task Wise Time Log",
                        data: e,
                        completeData,
                      })
                    }
                  />
                ) : null}
                {showTaskSection("pending_in_progress_task_time_log") ? (
                  <TableData
                    completeData={data?.pendingInPorgressTicketWiseTimeLog}
                    data={data?.pendingInPorgressTicketWiseTimeLog?.map(
                      ({
                        ticketTypeId,
                        masterId,
                        Ticket_Status,
                        Logging_Status,
                        ...rest
                      }) => ({
                        ...rest,
                        Ticket_Status: `${Ticket_Status} ${
                          Logging_Status ? `(${Logging_Status})` : ""
                        }`,
                      }),
                    )}
                    name={"Pending In Progress Task Time Log"}
                    ticketCodeRoute={ticketCodeRoute}
                    columnColorRules={{
                      Logged_Hours: (value, row) => {
                        if (Number(value) > Number(row?.Estimated_Hours))
                          return { color: "#e23f35", fontWeight: "bold" };
                        return "black";
                      },
                      Ticket_Status: (value) => {
                        if (value == "Open (Overdue)") {
                          return { color: "#e23f35", fontWeight: "bold" };
                        }
                        return "black";
                      },
                    }}
                    handleClick={(e, completeData) =>
                      setModalData({
                        name: "Pending In Progress Task Time Log",
                        data: e,
                        completeData,
                      })
                    }
                  />
                ) : null}
                {showTaskSection("completed_task_time_log") ? (
                  <TableData
                    completeData={data?.completedTicketWiseTimeLog}
                    data={data?.completedTicketWiseTimeLog?.map(
                      ({
                        ticketTypeId,
                        masterId,
                        Ticket_Status,
                        Logging_Status,
                        ...rest
                      }) => ({
                        ...rest,
                        Ticket_Status: `${Ticket_Status} ${
                          Logging_Status ? `(${Logging_Status})` : ""
                        }`,
                      }),
                    )}
                    name={"Completed Task Time Log"}
                    ticketCodeRoute={ticketCodeRoute}
                    columnColorRules={{
                      Logged_Hours: (value, row) => {
                        if (Number(value) > Number(row?.Estimated_Hours))
                          return { color: "#e23f35", fontWeight: "bold" };
                        return "black";
                      },
                      Ticket_Status: (value) => {
                        if (value == "Open (Overdue)") {
                          return { color: "#e23f35", fontWeight: "bold" };
                        }
                        return "black";
                      },
                    }}
                    handleClick={(e, completeData) =>
                      setModalData({
                        name: "Completed Task Time Log",
                        data: e,
                        completeData,
                      })
                    }
                  />
                ) : null}
                {showTaskSection("task_status_overview") ? (
                  <DonutChart
                    data={data?.taskStatusOverview}
                    name={"Task Status Overview"}
                  />
                ) : null}
                {showTaskSection("priority_wise_overview") ? (
                  <MultiRowProgressChart
                    data={data?.priorityStatusOverview}
                    heading="Priority Wise Overview"
                  />
                ) : null}
              </div>
            </>
          ) : null}
          {modalData ? (
            <TableModel
              data={{ result: modalData?.data || [] }}
              heading={modalData?.name || ""}
              show={!!modalData}
              onHide={() => setModalData(null)}
              ticketCodeRoute={ticketCodeRoute}
              columnColorRules={{
                Logged_Hours: (value, row) => {
                  if (Number(value) > Number(row?.Estimated_Hours)) {
                    return { color: "#e23f35", fontWeight: "bold" };
                  }
                  return "black";
                },
                Ticket_Status: (value, row) => {
                  /// for task model
                  if (value == "Open (Overdue)") {
                    return { color: "#e23f35", fontWeight: "bold" };
                  }
                  //  for project model
                  let statusId =
                    modalData?.completeData?.find(
                      (el) => el?.ticketCode == row?.ticket_Code,
                    )?.["TicketStatus.statusId"] ||
                    modalData?.completeData?.find(
                      (el) => el?.Ticket_Code == row?.Ticket_Code,
                    )?.statusId;
                  if (statusId == 614) {
                    return { color: "#000000", fontWeight: "bold" };
                  } else if (statusId == 615) {
                    return { color: "#0093DD", fontWeight: "bold" };
                  } else if (statusId == 616) {
                    return { color: "#34b9a3", fontWeight: "bold" };
                  }
                  return "black";
                },
                Priority: (value) => {
                  if (value == "High") {
                    return { color: "#e23f35", fontWeight: "bold" };
                  } else if (value == "Medium") {
                    return { color: "#dd8941", fontWeight: "semibold" };
                  } else if (value == "Low") {
                    return { color: "#34b9a3", fontWeight: "normal" };
                  }
                  return "black";
                },
              }}
            />
          ) : null}
        </>
      ) : null}
    </>
  );
};
