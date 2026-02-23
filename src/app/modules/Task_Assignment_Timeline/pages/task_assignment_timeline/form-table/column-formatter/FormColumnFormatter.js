import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FolderClock, LayoutList } from "lucide-react";
export function FormColumnFormatter(
  cellContent,
  row,
  rowIndex,
  { openDetailTimeLog, openDetailGridData, showTicketDetails }
) {
  return (
    <div className="space-x-2">

      {!showTicketDetails && (
        <OverlayTrigger
          overlay={<Tooltip id={`detail-${row.Id}`}>Detail</Tooltip>}
        >
          <button
            type="button"
            onClick={() => openDetailGridData(row.Id)}
            style={{ background: "none", border: "none", padding: 0 }}
          >
            <LayoutList className="w-4 h-4 text-black cursor-pointer" />
          </button>
        </OverlayTrigger>
      )}

      <OverlayTrigger
        overlay={<Tooltip id={`timelog-${row.Id}`}>Detail Time Log</Tooltip>}
      >
        <button
          type="button"
          onClick={() => {
            const detailId = row.Details?.[0]?.Id;
            if (detailId) {
              openDetailTimeLog(detailId);
            }
          }}
          style={{ background: "none", border: "none", padding: 0 }}
        >
          <FolderClock className="w-4 h-4 text-black cursor-pointer" />
        </button>
      </OverlayTrigger>

    </div>
  );
}