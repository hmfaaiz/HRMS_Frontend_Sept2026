import React from "react";
import { formatDates } from "../../../../../utils/common";

function InfoRow({ label, value , valueClassName}) {
  return (
    <div className="grid grid-cols-[160px_1fr] gap-x-2 py-0.5">
      <div className="font-medium text-black/70">{label}</div>
      <div className={`break-words ${valueClassName}`}>{value}</div>
    </div>
  );
}

export function BonusPolicyPanel({ data, panelMode }) {
  if (!panelMode) return null;

  if (!data) {
    return (
      <div className="w-full bg-tsecondary p-3 rounded-lg text-center text-black text-sm my-2">
        No active Bonus Policy found for this Subsidiary and Bonus Type.
      </div>
    );
  }

  const salaryMonthLabel =
    data?.salaryMonthOption === "SPECIFIC_MONTH"
      ? data?.SalaryMonth
        ? formatDates(
            new Date(data.SalaryMonth.year, data.SalaryMonth.month - 1, 1),
            "MMM-yyyy"
          )
        : "Not resolved"
      : "Current Salary";

  let cutOffLabel = "Not set";
  let cutOffValue = "N/A";
  if (data?.considerConfirmationDate) {
    cutOffLabel = "Cut-off Date (Confirmation) :";
    cutOffValue = data?.confirmationDateBefore
      ? formatDates(data.confirmationDateBefore, "dd-MMM-yyyy")
      : "N/A";
  } else if (data?.considerJoiningDate) {
    cutOffLabel = "Cut-off Date (Joining) :";
    cutOffValue = data?.joiningDateBefore
      ? formatDates(data.joiningDateBefore, "dd-MMM-yyyy")
      : "N/A";
  }

  return (
    <div className="w-full bg-tsecondary rounded-lg p-4 text-sm text-black my-2">
      <div className="grid grid-cols-12 gap-4">
        {/* Policy Overview */}
        <div className="col-span-6 border-r pr-4">
          <h6 className="font-bold text-primary mb-3">Policy Overview</h6>

          <InfoRow label="Salary to be considered :" value={salaryMonthLabel}  valueClassName="font-semibold" />
          
        </div>

        <div className="col-span-6 pl-4 pt-7">
          <InfoRow label="Multiplier :" value={data?.multiplier ?? 1}  valueClassName="font-semibold"/>
          <InfoRow label="Divisor :" value={data?.divisor ?? 1}  valueClassName="font-semibold"/>
        </div>

      
        <div className="col-span-12 border-t pt-3">
          <h6 className="font-bold text-primary mb-3">Eligibility Criteria</h6>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6 pr-4">
              <InfoRow label={cutOffLabel} value={cutOffValue} />
              <InfoRow
                label="Applicable Grades :"
                value={data?.gradeNames?.length ? data.gradeNames.join(", ") : "All"}
              />
            </div>

            <div className="col-span-6 pl-4">
              <InfoRow
                label="Applicable Employee Types :"
                value={
                  data?.employeeTypeNames?.length
                    ? data.employeeTypeNames.join(", ")
                    : "All"
                }
              />
              <InfoRow
                label="Applicable Earnings :"
                value={data?.earningNames?.length ? data.earningNames.join(", ") : "N/A"}
              />
            </div>
          </div>
        </div>

      
        {data?.serviceSlabs?.length > 0 && (
          <div className="col-span-12 border-t pt-4">
            <h6 className="font-bold text-primary mb-3">
              Service Slabs ({data.serviceSlabs.length})
            </h6>

            {/* <div className="overflow-x-auto">
              <table className="table table-head-custom table-hover">
                <thead>
                  <tr className="custom-table-header">
                    <th>From (Years)</th>
                    <th>To (Years)</th>
                    <th>Percentage / Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data.serviceSlabs.map((slab, idx) => (
                    <tr key={slab.Id || idx}>
              
                      <td>{slab.fromYear ?? "-"}</td>
                      <td>{slab.toYear ?? "-"}</td>
                      <td>{slab.value ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
}