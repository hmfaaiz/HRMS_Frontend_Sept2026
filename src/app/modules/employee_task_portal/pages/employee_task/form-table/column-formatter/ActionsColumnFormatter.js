import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { ClipboardList, Eye } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  { openTaskModal, openViewModal }
) {
  const isCompleted =
    row.taskStatus === "Completed" ||
    row.taskStatus === "Not Needed" ||
    row.isClearanceProvided === 1 ||
    row.isClearanceProvided === 2 ||
    row.isClearanceProvided === true;

  return (
    <div className="space-x-2">
      {!isCompleted && (
        <OverlayTrigger
          overlay={
            <Tooltip id={`task-tooltip-${row.Id}`}>
              Submit Task
            </Tooltip>
          }
        >
          <span
            className="cursor-pointer"
            onClick={() => openTaskModal(row.Id)}
          >
            <ClipboardList className="w-4 h-4 text-black" />
          </span>
        </OverlayTrigger>
      )}

      {isCompleted && (
        <OverlayTrigger
          overlay={
            <Tooltip id={`view-tooltip-${row.Id}`}>
              View Task
            </Tooltip>
          }
        >
          <span
            className="cursor-pointer"
            onClick={() => openViewModal(row.Id)}
          >
            <Eye className="w-4 h-4 text-black" />
          </span>
        </OverlayTrigger>
      )}
    </div>
  );
}
