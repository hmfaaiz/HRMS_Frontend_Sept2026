import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye, Pencil, Trash2 } from "lucide-react";

/**
 * Actions Column Formatter for Employee Onboarding Checklist table
 * @param {any} cellContent - Current cell content
 * @param {object} row - Current row data (grouped by employee)
 * @param {number} rowIndex - Row index
 * @param {object} tableProps - Context functions and access rights
 */
export function EmployeeOnboardingActionsColumnFormatter(
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
  // row.tasks now contains all tasks for this employee
  const tasksForEmployee = row.tasks || [];

  return (
    <div className="space-x-2">
      {/* View / Read */}
      <OverlayTrigger
        overlay={<Tooltip id={`view-tooltip-${row.Id}`}>View</Tooltip>}
      >
        <a
          onClick={() => openReadFormDialog(row.Id)}
        >
          <Eye className="w-4 h-4 text-black cursor-pointer" />
        </a>
      </OverlayTrigger>

      {/* Edit (only if access is allowed and task not approved) */}
      {isAccessForEdit && !row?.isApproved && (
        <OverlayTrigger
          overlay={<Tooltip id={`edit-tooltip-${row.Id}`}>Edit</Tooltip>}
        >
          <a onClick={() => openEditFormDialog(row.Id)}>
            <Pencil className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}

      {/* Delete (only if access is allowed and task not approved) */}
      {isAccessForDelete && !row?.isApproved && !row?.isPolicyAllowed && (
        <OverlayTrigger
          overlay={<Tooltip id={`delete-tooltip-${row.Id}`}>Delete</Tooltip>}
        >
          <a onClick={() => openDeleteFormDialog(row.Id)}>
            <Trash2 className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}
    </div>
  );
}
