import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  { setTravelRequestId, setWorkflowId, setTravelData }
) {
  return (
    <>
      <OverlayTrigger
        overlay={
          <Tooltip id="products-edit-tooltip">View Detail</Tooltip>
        }
      >
        <a
          title=""
          style={{ cursor: "pointer" }}
          onClick={() => {
            if (row?.requestBelongToEmpId) {
              setWorkflowId(row?.parentRecordId);
              setTravelRequestId(row?.requestBelongToEmpId);
              setTravelData(row);
            }
          }}
        >
          <Eye className="w-4 h-4" />
        </a>
      </OverlayTrigger>
    </>
  );
}
