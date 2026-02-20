import React, { useState } from "react";
import { Clock10, TicketCheck, TicketMinus, TicketPlus } from "lucide-react";
import StatsCard from "./StatsCard";
import TableModel from "./TableModel";
import { TableData } from "./TableData";
import DonutChart from "./DonutChart";
import MultiRowProgressChart from "./MultiRowProgressChart";

export default FormData = ({ data, isProject, actionsLoading, isTask }) => {
  const [modalData, setModalData] = useState(null);
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
                <DonutChart
                  data={data?.ticketStatusOverview}
                  name={"Ticket Status Overview"}
                />
                <MultiRowProgressChart
                  data={data?.ticketTypeOverview}
                  heading="Ticket Type Wise Overview"
                />
                <DonutChart
                  data={data?.priorityStatusOverview}
                  name={"Priority Status Overview"}
                />
                <MultiRowProgressChart
                  data={data?.employeeWiseTicketType?.map((el) => ({
                    ...el,
                    value: el?.No_of_Tasks,
                    label: el?.Assign_To,
                  }))}
                  heading="Employee Wise Overview"
                />
                <TableData
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
                  handleClick={(e) =>
                    setModalData({
                      name: "Recent Activity - Date Wise",
                      data: e,
                    })
                  }
                />
                <TableData
                  data={data?.employeeWiseTicketStatus?.map((el) => ({
                    Assign_To: el?.Assign_To || "-",
                    Total: el?.Total || "-",
                    To_Do: el?.To_Do || "-",
                    In_Progress: el?.In_Progress || "-",
                    Done: el?.Done || "-",
                  }))}
                  name={"Employee Wise Ticket Status Wise Overview"}
                  handleClick={(e) =>
                    setModalData({
                      name: "Employee Wise Ticket Status Wise Overview",
                      data: e,
                    })
                  }
                />
                <TableData
                  data={data?.overdueTickets?.map((el) => ({
                    ...el,
                  }))}
                  name={"Overdue Tickets"}
                  handleClick={(e) =>
                    setModalData({
                      name: "Overdue Tickets",
                      data: e,
                    })
                  }
                />
                <TableData
                  data={data?.ticketWiseTimeLog?.map(
                    ({ ticketId, ...rest }) => ({
                      ...rest,
                    }),
                  )}
                  name={"Tickets Wise Time Log"}
                  handleClick={(e) =>
                    setModalData({
                      name: "Tickets Wise Time Log",
                      data: e,
                    })
                  }
                />
                <TableData
                  data={data?.employeeWiseTimeLog?.map(
                    ({ employeeId, ...rest }) => ({
                      ...rest,
                    }),
                  )}
                  name={"Employee Wise Time Log"}
                  handleClick={(e) =>
                    setModalData({
                      name: "Employee Wise Time Log",
                      data: e,
                    })
                  }
                />
                <TableData
                  data={data?.ticketEmployeeWiseTimeLog?.map(
                    ({ employeeId, ticketId, ...rest }) => ({
                      ...rest,
                    }),
                  )}
                  name={"Employee Ticket Wise Time Log"}
                  handleClick={(e) =>
                    setModalData({
                      name: "Employee Ticket Wise Time Log",
                      data: e,
                    })
                  }
                />
                <TableData
                  data={data?.pendingInPorgressTicketWiseTimeLog?.map(
                    ({ ticketId, ...rest }) => ({
                      ...rest,
                    }),
                  )}
                  name={"Pending In Progress Ticket Time Log"}
                  handleClick={(e) =>
                    setModalData({
                      name: "Pending In Progress Ticket Time Log",
                      data: e,
                    })
                  }
                />
                <TableData
                  data={data?.completedTicketWiseTimeLog?.map(
                    ({ ticketId, ...rest }) => ({
                      ...rest,
                    }),
                  )}
                  name={"Completed Ticket Time Log"}
                  handleClick={(e) =>
                    setModalData({
                      name: "Completed Ticket Time Log",
                      data: e,
                    })
                  }
                />
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
                <DonutChart
                  data={data?.taskStatusOverview}
                  name={"Task Status Overview"}
                />
                <MultiRowProgressChart
                  data={data?.priorityStatusOverview}
                  heading="Priority Wise Overview"
                />
                <TableData
                  data={data?.recentActivity?.map((el) => ({
                    Date: new Date(el?.["updatedAt"])?.toDateString() || "-",
                    ticket_Code: el?.ticketCode,
                    ticket_Description: el?.ticketDescription,
                    priority: el?.["priorityLevel.formName"] || "-",
                    Employee: el?.["EmployeeProfile.name"] || "-",
                  }))}
                  name={"Recent Activity - Date Wise"}
                  handleClick={(e) =>
                    setModalData({
                      name: "Recent Activity - Date Wise",
                      data: e,
                    })
                  }
                />
                <TableData
                  data={data?.employeeWiseTicketStatus?.map((el) => ({
                    ticket_Code: el?.ticketCode,
                    ticket_Description: el?.ticketDescription,
                    Assign_To: el?.Assign_To || "-",
                    Ticket_Status: el?.Ticket_Status || "-",
                    No_of_Tasks: el?.No_of_Tasks || "-",
                  }))}
                  name={"Employee Wise Task Status Overview"}
                  handleClick={(e) =>
                    setModalData({
                      name: "Employee Wise Task Status Overview",
                      data: e,
                    })
                  }
                />
                <TableData
                  data={data?.overdueTickets?.map((el) => ({
                    ...el,
                  }))}
                  name={"Overdue Task"}
                  handleClick={(e) =>
                    setModalData({
                      name: "Overdue Task",
                      data: e,
                    })
                  }
                />
                <TableData
                  data={data?.ticketWiseTimeLog?.map(
                    ({ ticketTypeId, masterId, ...rest }) => ({
                      ...rest,
                    }),
                  )}
                  name={"Task Wise Time Log"}
                  handleClick={(e) =>
                    setModalData({
                      name: "Task Wise Time Log",
                      data: e,
                    })
                  }
                />
                <TableData
                  data={data?.employeeWiseTimeLog?.map(
                    ({ ticketTypeId, loggedByEmpId, ...rest }) => ({
                      ...rest,
                    }),
                  )}
                  name={"Employee Wise Time Log"}
                  handleClick={(e) =>
                    setModalData({
                      name: "Employee Wise Time Log",
                      data: e,
                    })
                  }
                />
                <TableData
                  data={data?.ticketEmployeeWiseTimeLog?.map(
                    ({ ticketTypeId, masterId, LoggedByEmpId, ...rest }) => ({
                      ...rest,
                    }),
                  )}
                  name={"Employee Task Wise Time Log"}
                  handleClick={(e) =>
                    setModalData({
                      name: "Employee Task Wise Time Log",
                      data: e,
                    })
                  }
                />
                <TableData
                  data={data?.pendingInPorgressTicketWiseTimeLog?.map(
                    ({ ticketTypeId, masterId, ...rest }) => ({
                      ...rest,
                    }),
                  )}
                  name={"Pending In Progress Task Time Log"}
                  handleClick={(e) =>
                    setModalData({
                      name: "Pending In Progress Task Time Log",
                      data: e,
                    })
                  }
                />
                <TableData
                  data={data?.completedTicketWiseTimeLog?.map(
                    ({ ticketTypeId, masterId, ...rest }) => ({
                      ...rest,
                    }),
                  )}
                  name={"Completed Task Time Log"}
                  handleClick={(e) =>
                    setModalData({
                      name: "Completed Task Time Log",
                      data: e,
                    })
                  }
                />
              </div>
            </>
          ) : null}
          {modalData ? (
            <TableModel
              data={{ result: modalData?.data || [] }}
              heading={modalData?.name || ""}
              show={!!modalData}
              onHide={() => setModalData(null)}
            />
          ) : null}
        </>
      ) : null}
    </>
  );
};
