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
    openReadFormDialog,
    isAccessForEdit,
    isAccessForDelete,
  }
) {
  const id = row.id || row.Id;
  return (
    <div className="space-x-2">
      <OverlayTrigger
        overlay={<Tooltip id="products-view-tooltip">View</Tooltip>}
      >
        <a onClick={() => openReadFormDialog(id)}>
          <Eye className="w-4 h-4 text-black cursor-pointer" />
        </a>
      </OverlayTrigger>

      {isAccessForEdit && (row.isActive || row.isActive === undefined) && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Edit</Tooltip>}
        >
          <a onClick={() => openEditFormDialog(id)}>
            <Pencil className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}

      {isAccessForDelete && (
        <OverlayTrigger
          overlay={
            <Tooltip id="products-delete-tooltip">
              {row.isActive !== false ? "Delete" : "Mark Active"}
            </Tooltip>
          }
        >
          {row.isActive !== false ? (
            <a onClick={() => openDeleteFormDialog(id, row.isActive)}>
              <Trash2 className="w-4 h-4 text-black cursor-pointer" />
            </a>
          ) : (
            <a onClick={() => openActiveFormDialog(id, row.isActive)}>
              <CirclePower className="w-4 h-4 text-black cursor-pointer" />
            </a>
          )}
        </OverlayTrigger>
      )}
    </div>
  );
}
