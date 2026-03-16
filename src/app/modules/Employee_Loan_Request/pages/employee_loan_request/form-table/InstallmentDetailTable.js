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

  const activeCashRowId = details.find(d => !!d.is_active_row)?.Id ?? null;
  const activeRow = details.find(d => !!d.is_active_row);
  
  const isCompleteLoanCase =
  activeRow &&
  !!activeRow.is_unchecked_active &&
  details
    .filter(d => !d.is_active_row)
    .every(d => Number(d.cash_payment || 0) >= Number(d.amount_received || 0));

  // Total loan = sum of all installments
  const totalLoan = details.reduce((sum, d) => sum + Number(d.amount_received || 0), 0);
const totalCashPaid = Number(activeRow?.cash_payment || 0);
const isUncheckedActiveCase = !!activeRow?.is_unchecked_active;


const secondLastRunningBalance =
  [...details].reverse().find(d => Number(d.running_balance || 0) > 0)?.running_balance || 0;

const lastRunningBalance =
  [...details].reverse().filter(d => Number(d.running_balance || 0) > 0)[1]?.running_balance || 0;
const finalRemainingBalance = isCompleteLoanCase
  ? 0
  : isUncheckedActiveCase
  ? lastRunningBalance        
  : secondLastRunningBalance; 

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
        <table
          className="table table-sm mb-0"
          style={{
            fontSize: "0.84em",
            borderCollapse: "separate",
            borderSpacing: "0 2px",
            minWidth: 680,
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#009EF4", color: "#fff" }}>
              <th style={{ padding: "8px 12px", width: 40, textAlign: "center" }}>#</th>
              <th style={{ padding: "8px 12px", textAlign: "center" }}>Payroll Month</th>
              <th style={{ padding: "8px 12px", textAlign: "center" }}>Installment Amount</th>
              <th style={{ padding: "8px 12px", textAlign: "center" }}>Cash Payment</th>
              <th style={{ padding: "8px 12px", textAlign: "center" }}>Running Balance</th>
              <th style={{ padding: "8px 12px", textAlign: "center" }}>Status</th>
            </tr>
          </thead>

          <tbody>
            {details.map((detail, idx) => {
              const installment       = Number(detail.amount_received || 0);
              const cashPayment       = Number(detail.cash_payment    || 0);
              const isDeducted        = !!detail.is_deducted;
              const isUncheckedActive = !!detail.is_unchecked_active;

              const isActiveCashRow = activeCashRowId != null && detail.Id === activeCashRowId;
              const isReverseRow    = cashPayment > 0 && !isActiveCashRow;

              let displayInstallment;
              if (isActiveCashRow) {
                displayInstallment = isUncheckedActive ? 0 : installment;
              } else if (isReverseRow) {
                displayInstallment = Math.max(installment - cashPayment, 0);
              } else {
                displayInstallment = installment;
              }

              const displayCashPayment = isActiveCashRow ? cashPayment : null;

              // ── Status badge ───────────────────────────────────────────────
              const showPending = displayInstallment > 0 && !isDeducted;

              return (
                <tr
                  key={detail.Id || idx}
                  style={{ background: idx % 2 === 0 ? "#ffffff" : "#f4f8ff" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#deeeff")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      idx % 2 === 0 ? "#ffffff" : "#f4f8ff")
                  }
                >
                  {/* # */}
                  <td style={{ padding: "7px 12px", textAlign: "center", color: "#6c757d" }}>
                    {idx + 1}
                  </td>

                  {/* Payroll Month */}
                  <td style={{ padding: "7px 12px", textAlign: "center", fontWeight: 500 }}>
                    {detail.payroll_month_date
                      ? format(new Date(detail.payroll_month_date), "MMM-yyyy")
                      : "—"}
                  </td>

                  {/* Installment Amount */}
                  <td style={{ padding: "7px 12px", textAlign: "center", fontWeight: 600 }}>
                    {formatNumberWithCommas(displayInstallment)}
                  </td>

                  {/* Cash Payment */}
                  <td style={{ padding: "7px 12px", textAlign: "center", fontWeight: 600 }}>
                    {displayCashPayment != null
                      ? formatNumberWithCommas(displayCashPayment)
                      : ""}
                  </td>

                  {/* Running Balance */}
                  <td style={{ padding: "7px 12px", textAlign: "center", fontWeight: 600, color: "#e65c00" }}>
                    {activeCashRowId !== null
                      ? isActiveCashRow
                        ? formatNumberWithCommas(finalRemainingBalance)
                        : ""
                      : isDeducted && Number(detail.running_balance) !== 0
                        ? formatNumberWithCommas(detail.running_balance)
                        : ""}
                  </td>

                  {/* Status Badge */}
                  <td style={{ padding: "7px 12px", textAlign: "center" }}>
                    {showPending && (
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 10px",
                          borderRadius: 20,
                          fontSize: "0.79em",
                          fontWeight: 700,
                          background: "rgba(255,193,7,0.15)",
                          color: "#856404",
                          border: "1px solid #ffc107",
                        }}
                      >
                        ⏳ Pending
                      </span>
                    )}
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