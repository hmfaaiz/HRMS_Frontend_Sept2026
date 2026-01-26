import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { CirclePower, Eye, Pencil, Trash2 } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  {
    openEditCustomerDialog,
    openDeleteCustomerDialog,
    openActiveCustomerDialog,
    openReadCustomerDialog,
    isAccessForEdit,
    isAccessForDelete,
  }
) {
  // TEMP: Force permissions for testing
  const TEST_MODE = true;
  const hasEditAccess = TEST_MODE ? true : isAccessForEdit;
  const hasDeleteAccess = TEST_MODE ? true : isAccessForDelete;

  // Active status
  const isActive =
    row.isActive !== undefined && row.isActive !== null
      ? row.isActive === 1 || row.isActive === true
      : true;

  return (
    <div className="space-x-2">
      {/* View */}
      <OverlayTrigger overlay={<Tooltip id={`view-${row.Id}`}>View</Tooltip>}>
        <a
          className="cursor-pointer"
          onClick={() => openReadCustomerDialog(row.Id)}
        >
          <Eye className="w-4 h-4 text-black" />
        </a>
      </OverlayTrigger>

      {/* Edit */}
      {hasEditAccess && isActive && (
        <OverlayTrigger overlay={<Tooltip id={`edit-${row.Id}`}>Edit</Tooltip>}>
          <a
            className="cursor-pointer"
            onClick={() => openEditCustomerDialog(row.Id)}
          >
            <Pencil className="w-4 h-4 text-black" />
          </a>
        </OverlayTrigger>
      )}

      {/* Delete / Activate */}
      {hasDeleteAccess && (
        <OverlayTrigger
          overlay={
            <Tooltip id={`action-${row.Id}`}>
              {isActive ? "Delete" : "Activate"}
            </Tooltip>
          }
        >
          {isActive ? (
            <a
              className="cursor-pointer"
              onClick={() => openDeleteCustomerDialog(row.Id, isActive)}
            >
              <Trash2 className="w-4 h-4 text-black" />
            </a>
          ) : (
            <a
              className="cursor-pointer"
              onClick={() => openActiveCustomerDialog(row.Id, isActive)}
            >
              <CirclePower className="w-4 h-4 text-black" />
            </a>
          )}
        </OverlayTrigger>
      )}
    </div>
  );
}
