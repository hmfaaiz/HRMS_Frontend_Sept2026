import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye, Pencil, Trash2 } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  {
    openEditFacilitatorDialog,
    openDeleteFacilitatorDialog,
    openReadFacilitatorDialog,
    isAccessForEdit,
    isAccessForDelete,
  }
) {
  const isUserRead = false;
  
  return (
    <div className="space-x-2">
      {/* VIEW */}
      <OverlayTrigger overlay={<Tooltip id="facilitator-view-tooltip">View</Tooltip>}>
        <a onClick={() => openReadFacilitatorDialog(row.raw)}>
          <Eye className="w-4 h-4 text-black cursor-pointer" />
        </a>
      </OverlayTrigger>

      {/* EDIT */}
      {isAccessForEdit && !row.isExist && (
        <OverlayTrigger overlay={<Tooltip id="facilitator-edit-tooltip">Edit</Tooltip>}>
          <a onClick={() => openEditFacilitatorDialog(row.raw)}>
            <Pencil className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}

      {/* DELETE */}
      {isAccessForDelete && !row.isExist && (
        <OverlayTrigger overlay={<Tooltip id="facilitator-delete-tooltip">Delete</Tooltip>}>
          <a onClick={() => openDeleteFacilitatorDialog(row.id, row.raw)}>
            <Trash2 className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}
    </div>
  );
}