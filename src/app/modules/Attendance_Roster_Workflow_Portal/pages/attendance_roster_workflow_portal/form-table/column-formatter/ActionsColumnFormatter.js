import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent, row, rowIndex,
  { setWorkflowId, setCurrentData }
) {
  return (
    <OverlayTrigger
      overlay={<Tooltip id="roster-workflow-view-tooltip">View Detail</Tooltip>}
    >
      <button
        type="button"
        className="btn btn-link p-0"
        onClick={() => {
          setWorkflowId(row?.parentRecordId);
          setCurrentData(row);
        }}
      >
        <Eye className="w-4 h-4" />
      </button>
    </OverlayTrigger>
  );
}