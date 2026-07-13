import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye, Pencil } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  { setWorkflowId, setCurrentData, attendanceRequest },
) {
  return (
    <div className="space-x-2">
      {row?.isAccessToUpdate ? (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">View Detail</Tooltip>}
        >
          <span
            onClick={() => attendanceRequest(row?.requestData?.Id)}
            style={{ cursor: "pointer" }}
          >
            <Pencil className="w-4 h-4" />
          </span>
        </OverlayTrigger>
      ) : null}
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
