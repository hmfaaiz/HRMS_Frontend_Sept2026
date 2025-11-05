import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { ShieldCheck, ShieldMinus } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,

  { openChangeStatusDialog, isAccessToChangeStatus }
) {
  return (
    <div className="space-x-2">
      {isAccessToChangeStatus && (
        <OverlayTrigger
          overlay={
            <Tooltip id="products-edit-tooltip">
              {!row?.deactiveFlag ? "De-Active" : "Active"}
            </Tooltip>
          }
        >
          <a
            title=""
            className=""
            onClick={() => openChangeStatusDialog(row.Id)}
          >
            {!row?.deactiveFlag ? (
              <ShieldCheck className="w-4 h-4 text-black cursor-pointer" />
            ) : (
              <ShieldMinus className="w-4 h-4 text-black cursor-pointer" />
            )}
          </a>
        </OverlayTrigger>
      )}
    </div>
  );
}
