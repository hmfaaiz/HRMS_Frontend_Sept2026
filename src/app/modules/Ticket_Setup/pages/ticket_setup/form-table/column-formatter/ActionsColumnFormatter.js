import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye, FolderClock, Pencil, Trash2 } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  {
    openEditDialog,
    openDetailTimeLog,
    openDeleteDialog,
    openReadDialog,
    isAccessForEdit,
    isAccessForDelete,
  },
) {
  return (
    <div className="space-x-2">
      <OverlayTrigger
        overlay={<Tooltip id="products-edit-tooltip">Detail Time Log</Tooltip>}
      >
        <button
          type="button"
          onClick={() => {
            openDetailTimeLog(row.Id);
          }}
          style={{ background: "none", border: "none", padding: 0 }}
        >
          <FolderClock className="w-4 h-4 text-black cursor-pointer" />
        </button>
      </OverlayTrigger>
      {/* View */}
      <OverlayTrigger overlay={<Tooltip id={`view-${row.Id}`}>View</Tooltip>}>
        <a className="cursor-pointer" onClick={() => openReadDialog(row.Id)}>
          <Eye className="w-4 h-4 text-black" />
        </a>
      </OverlayTrigger>

      {/* Edit */}
      {isAccessForEdit && row?.isActive && (
        <OverlayTrigger overlay={<Tooltip id={`edit-${row.Id}`}>Edit</Tooltip>}>
          <a className="cursor-pointer" onClick={() => openEditDialog(row.Id)}>
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
