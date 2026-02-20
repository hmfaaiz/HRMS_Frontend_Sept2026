import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye, Pencil, Trash2 } from "lucide-react";

/**
 * Column formatter for Payroll checklist actions
 */
export function SubsidiaryPayrollActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  {
    openEditFormDialog,
    openDeleteFormDialog,
    openReadFormDialog,
    isAccessForEdit,
    isAccessForDelete,
  },
) {
  return (
    <div className="space-x-2">
      {/* VIEW */}
      <OverlayTrigger overlay={<Tooltip>View</Tooltip>}>
        <a
          onClick={() =>
            openReadFormDialog(row.subsidiaryId, row.payroll_groupId)
          }
        >
          <Eye className="w-4 h-4 cursor-pointer" />
        </a>
      </OverlayTrigger>

      {/* EDIT */}
      {isAccessForEdit && (
        <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
          <a
            onClick={() =>
              openEditFormDialog(row.subsidiaryId, row.payroll_groupId)
            }
          >
            <Pencil className="w-4 h-4 cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}

      {/* DELETE */}
      {isAccessForDelete && (
        <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
          <a
            onClick={() =>
              openDeleteFormDialog(row.subsidiaryId, row.payroll_groupId)
            }
          >
            <Trash2 className="w-4 h-4 cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}
    </div>
  );
}
