import React from "react";
import { format } from "date-fns";
import { formatNumberWithCommas } from "../../../../../utils/common";

export function InstallmentDetailTable({ details, loading }) {
  if (loading) {
    return (
      <div style={{ padding: "16px 40px", color: "#009EF7", fontSize: "0.85em" }}>
        Loading installments...
      </div>
    );
  }

  if (!Array.isArray(details) || details.length === 0) {
    return (
      <div style={{ padding: "12px 40px", color: "#9098a9", fontSize: "0.85em" }}>
        No installment records found.
      </div>
    );
  }

  const deductedCount = details.filter((d) => d.is_deducted).length;
  const pendingCount = details.length - deductedCount;
  const totalAmount = details.reduce((sum, d) => sum + Number(d.amount_received || 0), 0);

  return (
    <div
      style={{
        background: "#f8faff",
        borderTop: "2px solid #d6e4ff",
        borderBottom: "2px solid #d6e4ff",
        padding: "14px 40px 18px",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table className="table table-sm mb-0" style={{ fontSize: "0.84em", borderCollapse: "separate", borderSpacing: "0 2px", minWidth: 580 }}>
          <thead>
            <tr style={{ backgroundColor: "#009EF4", color: "#fff" }}>
              <th style={{ padding: "8px 12px", borderRadius: "6px 0 0 6px", fontWeight: 600, width: 40, textAlign: "center" }}>#</th>
              <th style={{ padding: "8px 12px", fontWeight: 600, whiteSpace: "nowrap" }}>Payroll Month</th>
              <th style={{ padding: "8px 12px", fontWeight: 600, textAlign: "right", whiteSpace: "nowrap" }}>Installment Amount</th>
              <th style={{ padding: "8px 12px", fontWeight: 600, textAlign: "right", whiteSpace: "nowrap" }}>Running Balance</th>
              <th style={{ padding: "8px 12px", borderRadius: "0 6px 6px 0", fontWeight: 600, textAlign: "center", whiteSpace: "nowrap" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {details.map((detail, idx) => {
              const isDeducted = !!detail.is_deducted;
              const rowBg = idx % 2 === 0 ? "#ffffff" : "#f4f8ff";

              // Show running balance only when deducted AND balance is not 0 (not the last paid installment)
              const showRunningBalance = isDeducted && Number(detail.running_balance) !== 0;

              return (
                <tr
                  key={detail.Id || idx}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#deeeff")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = rowBg)}
                >
                  <td style={{ padding: "7px 12px", textAlign: "center", color: "#6c757d", fontWeight: 500 }}>{idx + 1}</td>
                  <td style={{ padding: "7px 12px", fontWeight: 500 }}>
                    {detail.payroll_month_date ? format(new Date(detail.payroll_month_date), "MMM-yyyy") : "—"}
                  </td>
                  <td style={{ padding: "7px 12px", textAlign: "right", fontWeight: 600, color: "#1a1a2e" }}>
                    {formatNumberWithCommas(detail.amount_received || 0)}
                  </td>
                  {/* Running balance: empty if pending OR if last deducted installment (balance = 0) */}
                  <td style={{ padding: "7px 12px", textAlign: "right", fontWeight: 600, color: "#e65c00" }}>
                    {showRunningBalance ? formatNumberWithCommas(detail.running_balance) : ""}
                  </td>
                  <td style={{ padding: "7px 12px", textAlign: "center" }}>
                    <span style={{
                      display: "inline-block", padding: "2px 10px", borderRadius: 20,
                      fontSize: "0.79em", fontWeight: 700, whiteSpace: "nowrap",
                      background: isDeducted ? "rgba(40,167,69,0.12)" : "rgba(255,193,7,0.15)",
                      color: isDeducted ? "#1a7a34" : "#856404",
                      border: `1px solid ${isDeducted ? "#28a745" : "#ffc107"}`,
                    }}>
                      {isDeducted ? "✓ Deducted" : "⏳ Pending"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}