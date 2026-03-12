import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye, Pencil, Trash2 } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  {
    openEditDialog,
    openDeleteDialog,
    openReadDialog,
    isAccessForEdit,
    isAccessForDelete,
  },
) {
  return (
    <div className="space-x-2">
      {/* View */}
      <OverlayTrigger overlay={<Tooltip id={`view-${row.Id}`}>View</Tooltip>}>
        <a
          className="cursor-pointer"
          onClick={() => openReadDialog(row.customerId)}
        >
          <Eye className="w-4 h-4 text-black" />
        </a>
      </OverlayTrigger>

      {/* Edit */}
      {isAccessForEdit && (
        <OverlayTrigger overlay={<Tooltip id={`edit-${row.Id}`}>Edit</Tooltip>}>
          <a
            className="cursor-pointer"
            onClick={() => openEditDialog(row.customerId)}
          >
            <Pencil className="w-4 h-4 text-black" />
          </a>
        </OverlayTrigger>
      )}

      {/* Delete / Activate */}
      {isAccessForDelete && (
        <OverlayTrigger
          overlay={<Tooltip id={`action-${row.Id}`}>Delete</Tooltip>}
        >
          <a
            className="cursor-pointer"
            onClick={() => openDeleteDialog(row.customerId)}
          >
            <Trash2 className="w-4 h-4 text-black" />
          </a>
        </OverlayTrigger>
      )}
    </div>
  );
}
