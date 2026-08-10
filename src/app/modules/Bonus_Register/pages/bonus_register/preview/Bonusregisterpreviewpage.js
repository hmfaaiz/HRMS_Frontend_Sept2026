import React, { useEffect, useState } from "react";
import { PreviewBonusRegisterPDFGroupBy } from "./Bonusregisterpdfgroupby";

export const BonusRegisterPreviewPage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("previewBonusRegisterPdf");

    if (raw) {
      const parsed = JSON.parse(raw);

      const payload = parsed?.data ?? parsed;
      setData(payload);
    }
  }, []);

  if (!data) return <p>No data found. Please go back...</p>;

  const { groupBy } = data;

  return (
    <>
      {groupBy ? (
        <PreviewBonusRegisterPDFGroupBy />
      ) : (
        <PreviewBonusRegisterPDF
          labels={data.labels}
          rows={data.rows}
          totals={data.totals}
          currencyName={data.currencyName}
        />
      )}
    </>
  );
};

const PreviewBonusRegisterPDF = ({
  labels = {},
  rows = [],
  totals = {},
  currencyName = "",
}) => {
  const isMultipleOf = (index, num) => (index + 1) % num === 0;
  localStorage.removeItem("previewBonusRegisterPdf"); // Clear it

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        margin: 20,
        backgroundColor: "#f9f9f9",
        zoom: 0.6,
        padding: 20,
      }}
    >
      <h1 style={{ textAlign: "left", color: "#333", fontSize: "36px" }}>
        Bonus Register
      </h1>

      <div
        className="header-info"
        style={{
          marginBottom: 20,
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

      <div style={{ height: "100vh", overflow: "auto" }}>
        <table
          className="bonus-table"
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
              <th>Designation</th>
              <th>Department</th>
              <th>Grade</th>
              <th className="amount">Salary Basis</th>
              <th>Service Duration</th>
              <th>Payment Type</th>
              <th className="amount">Bonus Amount</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td>{index + 1}</td>
                  <td>{row.employeeDisplay}</td>
                  <td>{row.designationName}</td>
                  <td>{row.departmentName}</td>
                  <td>{row.gradeName}</td>
                  <td className="amount">{row.EligibleSalaryFormatted}</td>
                  <td>{row.ServiceDurationLabel}</td>
                  <td>{row.PaymentType}</td>
                  <td className="amount">{row.BonusAmountFormatted}</td>
                </tr>

                {isMultipleOf(index, 20) && (
                  <tr key={`page-break-${index}`} className="page-break">
                    <td colSpan={9}></td>
                  </tr>
                )}
              </React.Fragment>
            ))}

            {/* Grand Total Row */}
            <tr
              className="tfoot"
              style={{ fontWeight: "bold", backgroundColor: "#ffeb3b" }}
            >
              <td colSpan="5" style={{ textAlign: "left" }}>
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

export default BonusRegisterPreviewPage;
