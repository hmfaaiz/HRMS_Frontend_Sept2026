import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { CircleCheckBig, Eye, Pencil, Power, Trash2 } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  {
    openEditDialog,
    openDeleteDialog,
    openReadDialog,
    openExcuteDialog,
    isAccessForEdit,
    isAccessForDelete,
    isAccessForSprintExcution,
  },
) {
  return (
    <div className="space-x-2">
      {/* View */}
      {isAccessForSprintExcution && !row?.isStart && !row?.isCompleted ? (
        <OverlayTrigger
          overlay={<Tooltip id={`view-${row.Id}`}>Start</Tooltip>}
        >
          <a
            className="cursor-pointer"
            onClick={() => openExcuteDialog(row.Id, "start")}
          >
            <Power className="w-4 h-4 text-black" />
          </a>
        </OverlayTrigger>
      ) : isAccessForSprintExcution && row?.isStart && !row?.isCompleted ? (
        <OverlayTrigger
          overlay={<Tooltip id={`view-${row.Id}`}>Complete</Tooltip>}
        >
          <a
            className="cursor-pointer"
            onClick={() => openExcuteDialog(row.Id, "complete")}
          >
            <CircleCheckBig className="w-4 h-4 text-black" />
          </a>
        </OverlayTrigger>
      ) : null}
      {/* View */}
      <OverlayTrigger overlay={<Tooltip id={`view-${row.Id}`}>View</Tooltip>}>
        <a className="cursor-pointer" onClick={() => openReadDialog(row.Id)}>
          <Eye className="w-4 h-4 text-black" />
        </a>
      </OverlayTrigger>

      {/* Edit */}
      {isAccessForEdit && row?.isActive && !row?.isCompleted && (
        <OverlayTrigger overlay={<Tooltip id={`edit-${row.Id}`}>Edit</Tooltip>}>
          <a className="cursor-pointer" onClick={() => openEditDialog(row.Id)}>
            <Pencil className="w-4 h-4 text-black" />
          </a>
        </OverlayTrigger>
      )}

      {/* Delete / Activate */}
      {isAccessForDelete &&
        row?.isActive &&
        !row?.isCompleted &&
        !row?.isStart && (
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
