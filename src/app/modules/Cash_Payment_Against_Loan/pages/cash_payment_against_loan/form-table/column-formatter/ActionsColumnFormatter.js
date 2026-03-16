import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye, Pencil, Trash2, CirclePower } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  {
    openEditFormDialog,
    openDeleteFormDialog,
    openActiveFormDialog,
    openViewFormDialog,
    isAccessForEdit,
    isAccessForDelete,
    isAccessForView,
    setIds,
    setIsViewMode,
    activePayrollMonthId,
  }
) {
  // Use isActiveMonth flag if backend provides it (most reliable)
  // Fallback: compare row.payrollMonthId against activePayrollMonthId from Redux
  const matchesActiveMonth =
    row.isActiveMonth === 1 ||
    row.isActiveMonth === true ||
    (
      activePayrollMonthId != null &&
      row.payrollMonthId   != null &&
      Number(row.payrollMonthId) === Number(activePayrollMonthId)
    );

  return (
    <div
      className="d-flex align-items-center justify-content-end"
      style={{ gap: "8px" }}
    >
      {/* Edit — only when payrollMonthId matches active month */}
      {matchesActiveMonth && isAccessForEdit && row.isActive && (
        <OverlayTrigger overlay={<Tooltip id={`edit-${row.Id}`}>Edit</Tooltip>}>
          <a style={{ cursor: "pointer" }} onClick={() => openEditFormDialog(row)}>
            <Pencil className="w-4 h-4 text-dark" />
          </a>
        </OverlayTrigger>
      )}

      {/* Delete / Activate */}
      {isAccessForDelete && (
        row.isActive ? (
          matchesActiveMonth && (
            <OverlayTrigger overlay={<Tooltip id={`del-${row.Id}`}>Delete</Tooltip>}>
              <a
                style={{ cursor: "pointer" }}
                onClick={() => openDeleteFormDialog(row.Id, row.isActive)}
              >
                <Trash2 className="w-4 h-4 text-dark" />
              </a>
            </OverlayTrigger>
          )
        ) : (
          <OverlayTrigger overlay={<Tooltip id={`active-${row.Id}`}>Mark Active</Tooltip>}>
            <a
              style={{ cursor: "pointer" }}
              onClick={() => openActiveFormDialog(row.Id, row.isActive)}
            >
              <CirclePower className="w-4 h-4 text-dark" />
            </a>
          </OverlayTrigger>
        )
      )}

      {/* View — always visible */}
      {isAccessForView && row.isActive && (
        <OverlayTrigger overlay={<Tooltip id={`view-${row.Id}`}>View</Tooltip>}>
          <a style={{ cursor: "pointer" }} onClick={() => openViewFormDialog(row)}>
            <Eye className="w-4 h-4 text-dark" />
          </a>
        </OverlayTrigger>
      )}
    </div>
  );
}