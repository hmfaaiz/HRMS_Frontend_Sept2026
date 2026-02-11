import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchTicketById } from "../../modules/Dashboard/_redux/dashboardActions";
import { PriorityType, TicketType } from "../common";

const TicketDetail = ({ ticketId, panelMode }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ticketId) {
      setLoading(true);
      dispatch(fetchTicketById(ticketId))
        .then((response) => {
          if (response) {
            setData(response);
          }
        })
        .catch((error) => {
          console.error("Error fetching ticket:", error);
          setData({});
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setData({});
    }
  }, [ticketId]);

  const formatEmployee = (employee) => {
    if (!employee) return "N/A";
    const name = `${employee.firstName || ""} ${employee.middleName ||
      ""} ${employee.lastName || ""}`.trim();
    return `${employee.employeeCode || ""}  ${name}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 bg-tsecondary rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      {panelMode && ticketId && (
        <div className="bg-tsecondary rounded-lg p-4">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2">
            <div>
              <h2 className="text-lg font-bold text-tprimary">Ticket Detail</h2>
            </div>
          </div>

          {/* Main Grid - 3 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {/* Left Column - Column 1 */}
            <div className="grid text-sm grid-cols-4 gap-y-2">
              <div className="text-black col-span-1">Ticket </div>
              <div className="font-medium text-black col-span-3">
                {data?.ticketDescription && data?.ticketCode
                  ? `${data?.ticketCode} ${data?.ticketDescription}`
                  : "N/A"}
              </div>

              <div className="text-black col-span-1">Project Name</div>
              <div className="font-medium text-black col-span-3">
                {data?.Project?.projectName && data?.Project?.projectCode
                  ? `${data?.Project?.projectCode}  ${data?.Project?.projectName}`
                  : "N/A"}
              </div>

              <div className="text-black col-span-1">Report To</div>
              <div className="font-medium text-black col-span-3">
                {formatEmployee(data?.ReportToEmp)}
              </div>

              <div className="text-black col-span-1">Assign To</div>
              <div className="font-medium text-black col-span-3">
                {formatEmployee(data?.AssignToEmp)}
              </div>

              <div className="text-black col-span-1">Start Date</div>
              <div className="font-medium text-black col-span-3">
                {data?.startDate || "N/A"}
              </div>

              <div className="text-black col-span-1">Due Date</div>
              <div className="font-medium text-black col-span-3">
                {data?.dueDate || "N/A"}
              </div>
            </div>

            {/* Right Column - Column 2 */}
            <div className="grid text-sm grid-cols-4">
              <div className="text-black col-span-1">Ticket Type</div>
              <div className="font-medium text-black col-span-3">
                {TicketType.find((el) => el.value == data?.ticketTypeId)
                  ?.label || "N/A"}
              </div>
              <div className="text-black col-span-1">Estimated Hours</div>
              <div className="font-medium text-black col-span-3">
                {data?.noOfHours || 0} hours
              </div>
              <div className="text-black col-span-1">Priority</div>
              <div className="font-medium text-black col-span-3">
                {PriorityType.find((e) => e.value == data?.priority)?.label ||
                  "N/A"}
              </div>

              <div className="text-black col-span-1">Ticket Status</div>
              <div className="font-medium text-black col-span-3">
                {data?.TicketStatus?.statusName || "N/A"}
              </div>

              <div className="text-black col-span-1">Parent Epic</div>
              <div className="font-medium text-black col-span-3">
                {data?.ParentEpic?.ticketSummary
                  ? `${data?.ParentEpic?.ticketCode} - ${data?.ParentEpic?.ticketSummary}`
                  : "N/A"}
              </div>

              <div className="text-black col-span-1">Parent Task</div>
              <div className="font-medium text-black col-span-3">
                {data?.ParentTask?.ticketSummary
                  ? `${data?.ParentTask?.ticketCode} - ${data?.ParentTask?.ticketSummary}`
                  : "N/A"}
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TicketDetail;
