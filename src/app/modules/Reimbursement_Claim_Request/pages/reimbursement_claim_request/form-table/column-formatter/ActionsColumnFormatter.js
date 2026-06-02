import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Minus, RotateCcw, Eye } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  { setIds, isAccessForReapply, setWorkflowId, setCurrentData }
) {
 return (
  <div className="flex items-center justify-end gap-3 w-full">
    {/* Left Side */}
    <div className="flex items-center gap-2">
      {isAccessForReapply &&
      row.isActive &&
      row.request_status === "R" &&
      row?.approved_status == 2 ? (
        <OverlayTrigger
          overlay={
            <Tooltip id="reimbursement-reapply-tooltip">
              Re-apply
            </Tooltip>
          }
        >
          <a className="cursor-pointer" onClick={() => setIds(row.Id)}>
            <RotateCcw className="w-4 h-4" />
          </a>
        </OverlayTrigger>
      ) : (
        <span className="font-bold">
          <Minus className="w-4 h-4" />
        </span>
      )}
    </div>

    {/* Right Side Eye Icon */}
    <div className="flex items-center">
      {row?.request_status === "P" ||
      row?.request_status === "A" ||
      row?.request_status === "R" ? (
        <OverlayTrigger
          overlay={
            <Tooltip id="view-workflow-tooltip">
              View Workflow
            </Tooltip>
          }
        >
          <a
            className="cursor-pointer"
            onClick={() => {
              setWorkflowId(row.Id);
              setCurrentData(row);
            }}
          >
            <Eye className="w-4 h-4 text-black" />
          </a>
        </OverlayTrigger>
      ) : (
        <span className="font-bold">
          <Minus className="w-4 h-4" />
        </span>
      )}
    </div>
  </div>
);
}