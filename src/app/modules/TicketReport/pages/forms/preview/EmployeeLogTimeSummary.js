import React from "react";

const formatNumber = (value) => {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  const number = Number(value);

  return Number.isFinite(number) ? number.toFixed(2) : "";
};

const EmployeeLogTimeSummaryPreview = ({ data, fromDate, toDate }) => {


  // API/preview object se actual employee array nikalo
  const employees = Array.isArray(data?.data) ? data.data : [];



  if (!employees.length) {
    return <div></div>;
  }

  const totalLegalHours = employees.reduce(
    (sum, employee) => sum + Number(employee.legalHours || 0),
    0
  );

  const totalBillableHours = employees.reduce(
    (sum, employee) => sum + Number(employee.loggedHoursBillable || 0),
    0
  );

  const totalNonBillableHours = employees.reduce(
    (sum, employee) => sum + Number(employee.loggedHoursNonBillable || 0),
    0
  );

  const totalIdleHours = employees.reduce(
    (sum, employee) => sum + Number(employee.idleHours || 0),
    0
  );

  const formatDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="w-full border border-gray-300 bg-white overflow-x-auto custom-scrollbar">
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            height: 5px;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #4F81BD;
            border-radius: 4px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: #3F6FA3;
          }

          .productivity-preview-table {
            border-collapse: collapse;
            width: 100%;
            min-width: 1250px;
          }

          .productivity-preview-table th,
          .productivity-preview-table td {
            border: 1px solid #d9d9d9;
          }

          .productivity-preview-table th {
            background-color: #4F81BD;
            color: white;
            font-weight: 700;
            text-align: center;
            vertical-align: middle;
            padding: 8px 6px;
            height: 45px;
            white-space: normal;
          }

          .productivity-preview-table td {
            padding: 7px 8px;
            vertical-align: middle;
            white-space: nowrap;
          }

          .productivity-preview-table tbody tr:hover {
            background-color: #f5f8fc;
          }

          .productivity-total-row td {
            background-color: #4F81BD;
            color: white;
            font-weight: 700;
          }
        `}
      </style>

      <table className="productivity-preview-table">
        <thead>
          <tr>
            <th
              colSpan={9}
              style={{
                backgroundColor: "#ffffff",
                color: "#000000",
                textAlign: "left",
                fontSize: "12px",
                fontWeight: "700",
                height: "45px",
                border: "none",
                padding: "8px",
              }}
            >
              Employee Logtime Summary
            </th>
          </tr>

          <tr>
          
          </tr>

          <tr>
            <th style={{ width: "40px" }}>Employee Code</th>
            <th
              style={{
                width: "130px",
                whiteSpace: "normal",
                wordBreak: "break-word",
              }}
            >
              Employee Name
            </th>
            <th
              style={{
                width: "100px",
                whiteSpace: "normal",
                wordBreak: "break-word",
              }}
            >
              Designation
            </th>
            <th
              style={{
                width: "100px",
                whiteSpace: "normal",
                wordBreak: "break-word",
              }}
            >
              Department
            </th>
            <th style={{ width: "70px" }}>Legal Hours</th>

            <th style={{ width: "115px" }}>
              Logged Hours

              (Billable)
            </th>

            <th style={{ width: "130px" }}>
              Logged Hours

              (Non-Billable)
            </th>

            <th style={{ width: "40px" }}>Idle Hours</th>
            <th style={{ width: "25px" }}>Rating</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((employee, index) => (
            <tr key={employee.employeeCode || index}>
              <td style={{ textAlign: "left" }}>
                {employee.employeeCode || ""}
              </td>

              <td  style={{
                  textAlign: "left",
                  whiteSpace: "normal",
                  overflowWrap: "anywhere",
                  maxWidth: "60ch",
                }}>
                {employee.employeeName || ""}
              </td>

              <td style={{
                textAlign: "left",
                whiteSpace: "normal",
                overflowWrap: "anywhere",
                maxWidth: "60ch",
              }}>
                {employee.designation || ""}
              </td>

              <td
                style={{
                  textAlign: "left",
                  whiteSpace: "normal",
                  overflowWrap: "anywhere",
                  maxWidth: "60ch",
                }}
              >
                {employee.department || ""}
              </td>

              <td style={{ textAlign: "right" }}>
                {formatNumber(employee.legalHours)}
              </td>

              <td style={{ textAlign: "right" }}>
                {formatNumber(employee.loggedHoursBillable)}
              </td>

              <td style={{ textAlign: "right" }}>
                {formatNumber(employee.loggedHoursNonBillable)}
              </td>

              <td style={{ textAlign: "right" }}>
                {formatNumber(employee.idleHours)}
              </td>

              <td style={{ textAlign: "center" }}>
                0.00
                {/* {employee.rating !== undefined
                  ? formatNumber(employee.rating)
                  : "0.00"} */}
              </td>
            </tr>
          ))}

          <tr>
            <td
              colSpan={9}
              style={{
                height: "15px",
                borderLeft: "none",
                borderRight: "none",
              }}
            />
          </tr>

          <tr className="productivity-total-row">
            <td></td>

            <td style={{ textAlign: "left" }}>TOTAL</td>

            <td></td>
            <td></td>

            <td style={{ textAlign: "right" }}>
              {totalLegalHours.toFixed(2)}
            </td>

            <td style={{ textAlign: "right" }}>
              {totalBillableHours.toFixed(2)}
            </td>

            <td style={{ textAlign: "right" }}>
              {totalNonBillableHours.toFixed(2)}
            </td>

            <td style={{ textAlign: "right" }}>
              {totalIdleHours.toFixed(2)}
            </td>

            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeLogTimeSummaryPreview;