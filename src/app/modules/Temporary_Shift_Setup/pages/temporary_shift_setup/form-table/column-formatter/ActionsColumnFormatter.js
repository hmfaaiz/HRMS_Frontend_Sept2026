import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye, Pencil, Trash2 } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  {
    openEditFormDialog,
    openDeleteFormDialog,
    isAccessForEdit,
    isAccessForDelete,
    openReadFormDialog,
  }
) {
  return (
    <div className="space-x-2">
      
      {/* View */}
      <OverlayTrigger overlay={<Tooltip>View</Tooltip>}>
        <a onClick={() => openReadFormDialog(row.Id)}>
          <Eye className="w-4 h-4 cursor-pointer" />
        </a>
      </OverlayTrigger>

      {/* Edit */}
      {isAccessForEdit && (
        <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
          <a onClick={() => openEditFormDialog(row.Id)}>
            <Pencil className="w-4 h-4 cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}

      {/* Delete */}
      {isAccessForDelete && (
        <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
          <a onClick={() => openDeleteFormDialog(row.Id)}>
            <Trash2 className="w-4 h-4 cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}
    </div>
  );
}