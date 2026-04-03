import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Minus, RotateCcw } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  { setIds, isAccessForReapply }
) {
  return (
    <>
      {isAccessForReapply &&
      row.isActive &&
      row.request_status === "R" &&
      row?.approved_status == 2 ? (
        <OverlayTrigger
          overlay={<Tooltip id="reimbursement-reapply-tooltip">Re-apply</Tooltip>}
        >
          <a className="cursor-pointer" onClick={() => setIds(row.Id)}>
            <RotateCcw className="w-4 h-4" />
          </a>
        </OverlayTrigger>
      ) : (
        <span className="font-bold">
          <Minus className="w-4 h-4" />
        </span>
      )}
    </>
  );
}