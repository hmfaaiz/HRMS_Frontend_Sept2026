import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Pencil, Trash2 } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  { openDeleteDialog, setId, isAccessForEdit, isAccessForDelete },
) {
  return (
    <div className="space-x-2">
      {/* Edit */}
      {isAccessForEdit && row?.isActive && (
        <OverlayTrigger overlay={<Tooltip id={`edit-${row.Id}`}>Edit</Tooltip>}>
          <a className="cursor-pointer" onClick={() => setId(row.Id)}>
            <Pencil className="w-4 h-4 text-black" />
          </a>
        </OverlayTrigger>
      )}

      {/* Delete / Activate */}
      {isAccessForDelete && row?.isActive && (
        <OverlayTrigger
          overlay={<Tooltip id={`action-${row.Id}`}>Delete</Tooltip>}
        >
          <a
            className="cursor-pointer"
            onClick={() => openDeleteDialog(row.Id)}
          >
            <Trash2 className="w-4 h-4 text-black" />
          </a>
        </OverlayTrigger>
      )}
    </div>
  );
}
