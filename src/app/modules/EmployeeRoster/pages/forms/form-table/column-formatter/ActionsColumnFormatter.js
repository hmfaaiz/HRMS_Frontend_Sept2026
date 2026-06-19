import React from "react";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { startOfDay, endOfDay, endOfMonth } from "date-fns";


function isWithinPayrollMonth(row, payroll) {
  if (!payroll?.startDate || !row?.from) return false;

  const rosterFrom = new Date(row.from).getTime();
  const payrollStart = startOfDay(new Date(payroll.startDate)).getTime();
  const payrollEnd = endOfDay(endOfMonth(new Date(payroll.startDate))).getTime();

  return rosterFrom >= payrollStart && rosterFrom <= payrollEnd;
}

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  {
    setId,
    openDeleteFormDialog,
    isAccessForEdit,
    isAccessForDelete,
    payrollData,
  }
) {
  const editable = isWithinPayrollMonth(row, payrollData);

  return (
    <div className="space-x-2">
      {/* Every request can be viewed, regardless of payroll month */}
      <OverlayTrigger
        overlay={<Tooltip id="products-view-tooltip">View</Tooltip>}
      >
        <a onClick={() => setId(row.Id)}>
          <Eye className="w-4 h-4 text-black cursor-pointer" />
        </a>
      </OverlayTrigger>

      {isAccessForEdit &&
        editable &&
        row.isFromPortal !== 1 &&
        row.isFromPortal !== true && (
          <OverlayTrigger
            overlay={<Tooltip id="products-edit-tooltip">Edit</Tooltip>}
          >
            <a onClick={() => setId(row.Id)}>
              <Pencil className="w-4 h-4 text-black cursor-pointer" />
            </a>
          </OverlayTrigger>
        )}

      {isAccessForDelete && editable && (
        <OverlayTrigger
          overlay={<Tooltip id="products-delete-tooltip">Delete</Tooltip>}
        >
          <a onClick={() => openDeleteFormDialog(row.Id)}>
            <Trash2 className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}
    </div>
  );
}