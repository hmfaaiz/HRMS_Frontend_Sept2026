import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  { setWorkflowId, setCurrentData }
) {
  return (
    <div className="d-flex justify-content-end">
      <OverlayTrigger
        overlay={<Tooltip id="products-edit-tooltip">View Detail</Tooltip>}
      >
        <a
          onClick={() => {
            setWorkflowId(row?.parentRecordId);
            setCurrentData(row);
          }}
          style={{ cursor: "pointer" }}
        >
          <Eye className="w-4 h-4" />
        </a>
      </OverlayTrigger>
    </div>
  );
}