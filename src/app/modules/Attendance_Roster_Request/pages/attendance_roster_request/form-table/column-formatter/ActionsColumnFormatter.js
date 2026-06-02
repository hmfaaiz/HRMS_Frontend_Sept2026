import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye, RotateCcw, Users, } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  {
    setIds,
    setViewRecord,
    isAccessForReapply,
    setWorkflowId,   
    setCurrentData,  
  }
) {
  return (
    <div className="flex justify-end items-center space-x-2">

      <OverlayTrigger overlay={<Tooltip id="roster-view-tooltip">View Employees</Tooltip>}>
        <a
          onClick={() => setViewRecord(row)}
          style={{ cursor: "pointer" }}
        >
          <Users className="w-4 h-4 text-black cursor-pointer" />
        </a>
      </OverlayTrigger>

      {(row?.request_status === "P" || row?.request_status === "A" || row?.request_status === "R") && (
        <OverlayTrigger overlay={<Tooltip id="roster-workflow-tooltip">View Workflow</Tooltip>}>
          <a
            style={{ cursor: "pointer" }}
            onClick={() => {
              setWorkflowId(row.Id);
              setCurrentData(row);
            }}
          >
            <Eye className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}

      {/* Resubmit — only if Rejected and user has access */}
      {isAccessForReapply && row?.request_status === "R" && (
        <OverlayTrigger overlay={<Tooltip id="roster-reapply-tooltip">Resubmit</Tooltip>}>
          <a
            onClick={() => setIds(row.Id)}
            style={{ cursor: "pointer" }}
          >
            <RotateCcw className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}

    </div>
  );
}