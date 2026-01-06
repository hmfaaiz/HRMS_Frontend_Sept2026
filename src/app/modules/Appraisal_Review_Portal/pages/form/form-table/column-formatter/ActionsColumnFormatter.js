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
    isAccessForRead,
  }
) {
  return (
    <div className="space-x-2">
      {isAccessForRead && row?.isActive && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">View</Tooltip>}
        >
          <a title="" className="" onClick={() => openReadDialog(row?.Id)}>
            <Eye className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}
      {isAccessForEdit && row?.isActive && !row?.isFinalize && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Edit</Tooltip>}
        >
          <a title="" className="" onClick={() => openEditDialog(row?.Id)}>
            <Pencil className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}
      {isAccessForDelete && row?.isActive && !row?.isFinalize && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Delete </Tooltip>}
        >
          <a title="" className="" onClick={() => openDeleteDialog(row?.Id)}>
            <Trash2 className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}
    </div>
  );
}
