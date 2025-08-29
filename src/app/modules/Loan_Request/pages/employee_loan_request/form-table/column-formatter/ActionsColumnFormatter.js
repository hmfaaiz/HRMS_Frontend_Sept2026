import React from "react";
import SVG from "react-inlinesvg";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
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
          overlay={<Tooltip id="products-edit-tooltip">Re-apply</Tooltip>}
        >
          <a className="" onClick={() => setIds(row.Id)}>
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
