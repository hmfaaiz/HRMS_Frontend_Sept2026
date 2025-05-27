import React from "react";
import SVG from "react-inlinesvg";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

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
        row?.approved_status == 2 && (
          <OverlayTrigger
            overlay={<Tooltip id="products-edit-tooltip">Re apply</Tooltip>}
          >
            <a
              title=""
              className="btn btn-icon view-button"
              onClick={() => {
                setIds(row.Id);
              }}
            >
              <span className="svg-icon svg-icon-md svg-icon-primary">
                <SVG src={toAbsoluteUrl("/media/svg/icons/Media/Repeat.svg")} />
              </span>
            </a>
          </OverlayTrigger>
        )}
    </>
  );
}
