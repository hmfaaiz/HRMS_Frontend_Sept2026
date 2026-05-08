import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye, Pencil } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  { setTravelRequestId, setWorkflowId, setTravelData, setApprovalId }
) {
  return (
    <div className="flex items-center gap-2">
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
          <Eye className="w-4 h-4 text-black" />
        </a>
      </OverlayTrigger>

      {row?.authorityStatus === "P" && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Process</Tooltip>}
        >
          <a
            title=""
            style={{ cursor: "pointer" }}
            onClick={() => {
              setApprovalId(row?.Id);
              setTravelRequestId(row?.requestBelongToEmpId);
            }}
          >
            <Pencil className="w-4 h-4 text-black" />
          </a>
        </OverlayTrigger>
      )}
    </div>
  );
}
