import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { CirclePower, Eye, Pencil, Trash2 } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,

  { openEditFormDialog, openReadFormDialog, isAccessForEdit, isAccessForRead }
) {
  const isUserRead = false;
  return (
    <div className="space-x-2">
      {isAccessForRead && row?.isSubmitted && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">View</Tooltip>}
        >
          <a title="" className="" onClick={() => openReadFormDialog(row.Id)}>
            <Eye className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}
      {isAccessForEdit && !row?.isSubmitted && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Fill Questions</Tooltip>}
        >
          <a title="" className="" onClick={() => openEditFormDialog(row.Id)}>
            <Pencil className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}
    </div>
  );
}
