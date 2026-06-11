import React from "react";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { ClockFading, Eye } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  { viewttendanceLogs, setWorkflowId, setCurrentData } 
) {
  return (
    <div className="d-flex justify-end gap-2">
    
    {(row?.request_status === "P" || row?.request_status === "A" || row?.request_status === "R") && (
        <OverlayTrigger overlay={<Tooltip id="att-workflow-tooltip">View Workflow</Tooltip>}>
          <span
            className="cursor-pointer ml-2"
            onClick={() => {
              setWorkflowId(row.Id);
              setCurrentData(row);
            }}
          >
            <Eye className="w-4 h-4 text-black" />
          </span>
        </OverlayTrigger>
      )}
      <OverlayTrigger overlay={<Tooltip id="att-logs-tooltip">View Logs</Tooltip>}>
        <span className="cursor-pointer" onClick={() => viewttendanceLogs(row?.attDate)}>
          <ClockFading className="w-4 h-4 pointer" />
        </span>
      </OverlayTrigger>

      
    </div>
  );
}