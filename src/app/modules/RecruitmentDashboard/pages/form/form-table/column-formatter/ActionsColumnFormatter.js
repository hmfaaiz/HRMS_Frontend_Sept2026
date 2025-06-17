import React from "react";
import SVG from "react-inlinesvg";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,

  {

    isAccessForView,
    openApplicantReadFormDialog,


  }
) {
;

  return (


    <div className="d-flex flex-nowrap align-items-center">




   
      {/* View */}
        {isAccessForView && (
          <OverlayTrigger overlay={<Tooltip id="view-tooltip">View</Tooltip>}>
            <a
              className="btn btn-icon view-button"
              onClick={() => openApplicantReadFormDialog(row.Id)}
            >
              <span className="svg-icon svg-icon-md svg-icon-primary">
                <SVG src={toAbsoluteUrl("/media/svg/icons/Communication/view.svg")} />
              </span>
            </a>
          </OverlayTrigger>
        )}


    </div>

  );
}
