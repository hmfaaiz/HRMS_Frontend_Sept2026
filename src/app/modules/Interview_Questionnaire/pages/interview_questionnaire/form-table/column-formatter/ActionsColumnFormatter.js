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
    openReadFormDialog,
    isAccessForEdit,
    isAccessForDelete,
  }
) {
  return (
    <div className="space-x-2">

      {/* View */}
      <OverlayTrigger
        overlay={<Tooltip id="interview-view-tooltip">View</Tooltip>}
      >
        <a
          title=""
          className=""
          onClick={() => openReadFormDialog(row.Id)}
        >
          <Eye className="w-4 h-4 text-black cursor-pointer" />
        </a>
      </OverlayTrigger>

      {/* Edit */}
      {isAccessForEdit && (
        <OverlayTrigger
          overlay={<Tooltip id="interview-edit-tooltip">Edit</Tooltip>}
        >
          <a
            title=""
            className=""
            onClick={() => openEditFormDialog(row.Id)}
          >
            <Pencil className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}

      {/* Delete */}
      {isAccessForDelete && (
        <OverlayTrigger
          overlay={
            <Tooltip id="interview-delete-tooltip">
              {row.isActive ? "Delete" : "Mark Active"}
            </Tooltip>
          }
        >
          <a
            title=""
            className=""
            onClick={() => openDeleteFormDialog(row.Id, row.isActive)}
          >
            <Trash2 className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}

    </div>
  );
}