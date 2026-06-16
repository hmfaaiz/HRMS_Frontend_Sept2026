import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { CirclePower, Eye, Trash2, Pencil } from "lucide-react";

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
      <OverlayTrigger
        overlay={<Tooltip id="budget-view-tooltip">View</Tooltip>}
      >
        <a title="" onClick={() => openReadFormDialog(row.Id)}>
          <Eye className="w-4 h-4 text-black cursor-pointer" />
        </a>
      </OverlayTrigger>

      {isAccessForEdit && row.isActive && (
        <OverlayTrigger
          overlay={<Tooltip id="budget-edit-tooltip">Edit</Tooltip>}
        >
          <a
            title=""
            onClick={() => openEditFormDialog(row.Id)}
          >
            <Pencil className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}

      <> </>

      {isAccessForDelete && row.isActive && (
        <OverlayTrigger
          overlay={
            <Tooltip id="budget-delete-tooltip">
              {row.isActive ? "Delete" : "Mark Active"}
            </Tooltip>
          }
        >
          {row.isActive && (
            <a
              title=""
              onClick={() => openDeleteFormDialog(row.Id, row.isActive)}
            >
              <Trash2 className="w-4 h-4 text-black cursor-pointer" />
            </a>
          )}
        </OverlayTrigger>
      )}
    </div>
  );
}
