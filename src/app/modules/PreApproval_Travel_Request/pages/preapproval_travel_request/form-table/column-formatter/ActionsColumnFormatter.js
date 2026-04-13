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
    <div className="space-x-2 flex justify-start">
      <OverlayTrigger
        overlay={<Tooltip id="products-view-tooltip">View</Tooltip>}
      >
        <a onClick={() => openReadFormDialog(row)}>
          <Eye className="w-4 h-4 text-black cursor-pointer" />
        </a>
      </OverlayTrigger>

      {row.request_status !== "A" && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Edit</Tooltip>}
        >
          <a onClick={() => openEditFormDialog(row)}>
            <Pencil className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}

      {row.request_status !== "A" && (
        <OverlayTrigger
          overlay={<Tooltip id="products-delete-tooltip">Delete</Tooltip>}
        >
          <a onClick={() => openDeleteFormDialog(id)}>
            <Trash2 className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}
    </div>
  );
}
