import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  { openReadFormDialog },
) {
  return (
    <div className="space-x-2 flex justify-start">
      <OverlayTrigger
        overlay={<Tooltip id="products-view-tooltip">View</Tooltip>}
      >
        <a onClick={() => openReadFormDialog(row)}>
          <Eye className="w-4 h-4 text-black cursor-pointer" />
        </a>
      </OverlayTrigger>
    </div>
  );
}
