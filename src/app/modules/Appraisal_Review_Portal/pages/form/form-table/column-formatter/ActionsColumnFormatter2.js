import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Plus } from "lucide-react";

export function ActionsColumnFormatter2(
  cellContent,
  row,
  rowIndex,

  { newButtonClick, isAccessForCreate, setEmployeeId },
) {
  return (
    <div className="space-x-2">
      {isAccessForCreate && row?.isActive && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Create</Tooltip>}
        >
          <span
            title=""
            className=""
            onClick={() => {
              setEmployeeId(row?.Id);
              newButtonClick();
            }}
          >
            <Plus className="w-4 h-4 text-black cursor-pointer" />
          </span>
        </OverlayTrigger>
      )}
    </div>
  );
}
