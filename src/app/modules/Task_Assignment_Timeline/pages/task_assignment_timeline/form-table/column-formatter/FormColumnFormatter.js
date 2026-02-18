import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { LayoutList, FolderClock } from "lucide-react";

export function FormColumnFormatter(
  cellContent,
  row,
  rowIndex,
  { openDetailGridData, openDetailTimeLog }
) {
  return (
    <div className="space-x-2">
      {/* Detail Button */}
      <OverlayTrigger
        overlay={<Tooltip id={`detail-${row.Id}`}>Detail</Tooltip>}
      >
        <button
          type="button"
          onClick={() => {
            openDetailGridData(row.Id);
          }}
          style={{ background: "none", border: "none", padding: 0 }}
        >
          <LayoutList className="w-4 h-4 text-black cursor-pointer" />
        </button>
      </OverlayTrigger>

      {/* Detail Time Log Button */}
      <OverlayTrigger
        overlay={<Tooltip id={`timelog-${row.Id}`}>Detail Time Log</Tooltip>}
      >
        <button
          type="button"
          onClick={() => {
            openDetailTimeLog(row.Id);
          }}
          style={{ background: "none", border: "none", padding: 0 }}
        >
          <FolderClock className="w-4 h-4 text-black cursor-pointer" />
        </button>
      </OverlayTrigger>
    </div>
  );
}
