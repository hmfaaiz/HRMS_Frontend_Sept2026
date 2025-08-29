import React from "react";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye, Pencil } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  { payrollData, setLeaveId, isAccessForEdit, isAccessForRead, setId }
) {
  //Function to check if the date doesn't lie before the payroll month date
  const checkPayrolMonth = (row, payroll) => {
    return (
      payroll &&
      payroll.startDate &&
      new Date(payroll.startDate).getTime() <= new Date(row.to).getTime()
    );
  };

  return (
    <div className="space-x-2">
      {isAccessForEdit && row.isActive && checkPayrolMonth(row, payrollData) && (
        <OverlayTrigger
          overlay={
            <Tooltip id="products-edit-tooltip">Edit Attendance Detail</Tooltip>
          }
        >
          <a
            onClick={() => {
              setLeaveId(row.Id);
            }}
          >
            <Pencil className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}

      {isAccessForRead && row.isActive && (
        <OverlayTrigger
          overlay={
            <Tooltip id="products-edit-tooltip">View Attendance Detail</Tooltip>
          }
        >
          <a
            onClick={() => {
              setId(row.Id);
            }}
          >
            <Eye className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}
    </div>
  );
}
