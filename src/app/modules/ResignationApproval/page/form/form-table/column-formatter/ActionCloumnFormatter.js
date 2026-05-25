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
    <>
    <div className="flex items-center justify-end gap-2">
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
      </div>
    </>
  );
}
