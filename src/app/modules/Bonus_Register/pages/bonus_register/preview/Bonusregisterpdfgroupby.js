import React, { useEffect, useState } from "react";

export const PreviewBonusRegisterPDFGroupBy = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("previewBonusRegisterPdf");

    if (raw) {
      const parsed = JSON.parse(raw);
      const payload = parsed?.data ?? parsed;
      setData(payload);

      localStorage.removeItem("previewBonusRegisterPdf");
    }
  }, []);

  if (!data) {
    return <div>No data found. Please go back.</div>;
  }

  const {
    labels = {},
    obj = {},
    totals = {},
    currencyName = "",
    showDesignation = true,
    showDepartment = true,
    showGrade = true,
    totalColumns = 9,
    labelColspan = 6,
  } = data;

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h1 style={{ textAlign: "left", color: "#333", fontSize: "36px" }}>
        Bonus Register
      </h1>

      <div
        style={{
          marginBottom: "20px",
          display: "grid",
          gridTemplateColumns: "max-content max-content",
          columnGap: 60,
          rowGap: 6,
        }}
      >
        {labels?.subsidiaryLabel && (
          <p
            style={{
              gridColumn: 1,
              gridRow: 1,
              margin: 0,
              whiteSpace: "nowrap",
            }}
          >
            Subsidiary: <strong>{labels.subsidiaryLabel}</strong>
          </p>
        )}
        {labels?.monthLabel && (
          <p
            style={{
              gridColumn: 2,
              gridRow: 1,
              margin: 0,
              whiteSpace: "nowrap",
            }}
          >
            For the Month of: <strong>{labels.monthLabel}</strong>
          </p>
        )}
        {labels?.bonusTypeLabel && (
          <p
            style={{
              gridColumn: 1,
              gridRow: 2,
              margin: 0,
              whiteSpace: "nowrap",
            }}
          >
            Bonus Type: <strong>{labels.bonusTypeLabel}</strong>
          </p>
        )}
        {labels?.groupWiseLabel && (
          <p
            style={{
              gridColumn: 2,
              gridRow: 2,
              margin: 0,
              whiteSpace: "nowrap",
            }}
          >
            Group By: <strong>{labels.groupWiseLabel}</strong>
          </p>
        )}
      </div>

      <div style={{ height: "60vh", overflow: "auto" }}>
        <table
          className="bonus-register-groupBy"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "#fff",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <thead>
            <tr className="table-heade">
              <th>S. No.</th>
              <th>Employee</th>
              {showDesignation && <th>Designation</th>}
              {showDepartment && <th>Department</th>}
              {showGrade && <th>Grade</th>}
              <th className="amount">Salary Basis</th>

              <th>Service Duration</th>
              <th>Payment Type</th>
              <th className="amount">Bonus Amount</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(obj).map(
              ([groupName, { data: employees, totals: groupTotals }]) => (
                <React.Fragment key={groupName}>
                  {/* Group Title Row */}
                  <tr style={{ backgroundColor: "#f1ce83" }}>
                    <td colSpan={totalColumns} style={{ textAlign: "left" }}>
                      <strong>{groupName}</strong>
                    </td>
                  </tr>

                  {/* Employee Rows */}
                  {employees.map((employee, empIndex) => (
                    <tr key={empIndex}>
                      <td>{empIndex + 1}</td>
                      <td>{employee.employeeDisplay}</td>
                      {showDesignation && <td>{employee.designationName}</td>}
                      {showDepartment && <td>{employee.departmentName}</td>}
                      {showGrade && <td>{employee.gradeName}</td>}
                      <td className="amount">
                        {employee.EligibleSalaryFormatted}
                      </td>

                      <td>{employee.ServiceDurationLabel}</td>

                      <td>{employee.PaymentType}</td>

                      <td className="amount">
                        {employee.BonusAmountFormatted}
                      </td>
                    </tr>
                  ))}

                  {/* Subtotal Row */}
                  <tr
                    style={{ backgroundColor: "#83f183", fontWeight: "bold" }}
                  >
                    <td colSpan={labelColspan} style={{ textAlign: "left" }}>
                      Sub Total
                    </td>
                    <td className="amount">
                      {groupTotals?.EligibleSalaryFormatted}
                    </td>

                    <td></td>

                    <td></td>

                    <td className="amount">
                      {groupTotals?.BonusAmountFormatted}
                    </td>
                  </tr>
                </React.Fragment>
              ),
            )}

            {/* Grand Total Row */}
            <tr style={{ backgroundColor: "#ffeb3b", fontWeight: "bold" }}>
              <td colSpan={labelColspan} style={{ textAlign: "left" }}>
                Grand Total
              </td>
              <td className="amount">{totals?.EligibleSalaryFormatted}</td>

              <td></td>

              <td></td>

              <td className="amount">
                {currencyName} {totals?.BonusAmountFormatted}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PreviewBonusRegisterPDFGroupBy;
