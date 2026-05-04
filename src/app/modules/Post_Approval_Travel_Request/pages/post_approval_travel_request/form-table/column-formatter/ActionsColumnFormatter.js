import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye, Pencil, Trash2 } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  { openReadFormDialog, openEditFormDialog, openDeleteFormDialog },
) {
  const id = row.id || row.Id;

  return (
    <div className="space-x-2 flex justify-end">
      {/* View — always visible */}
      <OverlayTrigger
        overlay={<Tooltip id="post-approval-view-tooltip">View</Tooltip>}
      >
        <a className="cursor-pointer" onClick={() => openReadFormDialog(row)}>
          <Eye className="w-4 h-4 text-black cursor-pointer" />
        </a>
      </OverlayTrigger>

      {/* Edit — only when pending approval */}
      {row.approved_status === 0 && (
        <OverlayTrigger
          overlay={<Tooltip id="post-approval-edit-tooltip">Edit</Tooltip>}
        >
          <a className="cursor-pointer" onClick={() => openEditFormDialog(row)}>
            <Pencil className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}

      {/* Delete — only when pending approval */}
      {row.approved_status === 0 && (
        <OverlayTrigger
          overlay={<Tooltip id="post-approval-delete-tooltip">Delete</Tooltip>}
        >
          <a className="cursor-pointer" onClick={() => openDeleteFormDialog(id)}>
            <Trash2 className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}
    </div>
  );
}