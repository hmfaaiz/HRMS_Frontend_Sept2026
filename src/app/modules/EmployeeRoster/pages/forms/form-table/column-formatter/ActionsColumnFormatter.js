import React from "react";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye, Pencil, Trash2 } from "lucide-react";

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
  //Function to check if the date doesn't lie before the payroll month date
  const checkPayrolMonth = (row, payroll) => {
    return (
      payroll &&
      payroll.startDate &&
      new Date(payroll.startDate).getTime() <= new Date(row.from).getTime()
    );
  };

  return (
    <div className="space-x-2">
      {!checkPayrolMonth(row, payrollData) && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">View</Tooltip>}
        >
          <a onClick={() => setId(row.Id)}>
            <Eye className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}

     {isAccessForEdit && checkPayrolMonth(row, payrollData) && row.isFromPortal !== 1 && row.isFromPortal !== true && (
          <OverlayTrigger
            overlay={<Tooltip id="products-edit-tooltip">Edit</Tooltip>}
          >
            <a onClick={() => setId(row.Id)}>
              <Pencil className="w-4 h-4 text-black cursor-pointer" />
            </a>
          </OverlayTrigger>
        )}

      {isAccessForDelete && checkPayrolMonth(row, payrollData) && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Delete</Tooltip>}
        >
          {
            <a onClick={() => openDeleteFormDialog(row.Id)}>
              <Trash2 className="w-4 h-4 text-black cursor-pointer" />
            </a>
          }
        </OverlayTrigger>
      )}
    </div>
  );
}
