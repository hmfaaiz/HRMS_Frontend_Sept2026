import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye, RotateCcw } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  {
    setIds,
    setViewRecord,
    isAccessForReapply,
  }
) {
  return (
    <div className="space-x-2">

      <OverlayTrigger overlay={<Tooltip id="roster-view-tooltip">View</Tooltip>}>
        <a
          onClick={() => setViewRecord(row)}
          style={{ cursor: "pointer" }}
        >
          <Eye className="w-4 h-4 text-black cursor-pointer" />
        </a>
      </OverlayTrigger>

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