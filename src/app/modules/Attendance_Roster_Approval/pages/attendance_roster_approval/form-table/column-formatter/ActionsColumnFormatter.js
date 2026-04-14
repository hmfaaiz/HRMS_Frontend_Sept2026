import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent, row, rowIndex,
  { setWorkflowId, setCurrentData }
) {
  return (
    <OverlayTrigger overlay={<Tooltip>View Detail</Tooltip>}>
      <a
        style={{ cursor: "pointer" }}
        onClick={() => {
          setWorkflowId(row?.parentRecordId);
          setCurrentData(row);
        }}
      >
        <Eye className="w-4 h-4" />
      </a>
    </OverlayTrigger>
  );
}