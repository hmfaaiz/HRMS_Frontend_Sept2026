import { Eye } from "lucide-react";
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  { setWorkflowId, setCurrentData }
) {
  return (
    <>
      <OverlayTrigger
        overlay={<Tooltip id="products-edit-tooltip">View Detail</Tooltip>}
      >
        <a
          onClick={() => {
            setWorkflowId(row?.parentRecordId);
            setCurrentData(row);
          }}
        >
          <Eye className="w-4 h-4" />
        </a>
      </OverlayTrigger>
    </>
  );
}
