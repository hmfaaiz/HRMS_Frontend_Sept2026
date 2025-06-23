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
    openEditFormDialog,
    openDeleteFormDialog,
    openActiveFormDialog,
    openConvertFormDialog,
    openReadFormDialog,
    isAccessForEdit,
    isAccessForView,
    isAccessForDelete,
    isAccessForConvert,
   
  }
) {
  const isUserRead = false;
  return (



    <div className="d-flex flex-nowrap align-items-center">


      {isAccessForConvert && (
        <OverlayTrigger overlay={<Tooltip id="emp-convert-tooltip">Convert to Employee</Tooltip>}>
          <a
            className="btn btn-icon posting-button"
          onClick={() => openConvertFormDialog(row.Id)}
          >
            <span className="svg-icon svg-icon-md svg-icon-primary">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Communication/vacancyPost.svg")} />
            </span>
          </a>
        </OverlayTrigger>
      )}

      {/* View */}
      {isAccessForView && (
        <OverlayTrigger overlay={<Tooltip id="view-tooltip">View</Tooltip>}>
          <a
            className="btn btn-icon view-button"
            onClick={() => openReadFormDialog(row.Id)}
          >
            <span className="svg-icon svg-icon-md svg-icon-primary">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Communication/view.svg")} />
            </span>
          </a>
        </OverlayTrigger>
      )}

      {/* Edit */}
      {isAccessForEdit && !row?.jobPostingStatus && (
        <OverlayTrigger overlay={<Tooltip id={`edit-tooltip-${row.Id}`}>Edit</Tooltip>}>
          <a
            className="btn btn-icon edit-button"
            onClick={() => openEditFormDialog(row.Id)}
          >
            <span className="svg-icon svg-icon-md svg-icon-primary">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")} />
            </span>
          </a>
        </OverlayTrigger>
      )}

      {/* Delete or Activate */}
      {isAccessForDelete && !row?.jobPostingStatus && (
        <OverlayTrigger
          overlay={
            <Tooltip id="delete-tooltip">
              {row.isActive ? "Delete" : "Mark Active"}
            </Tooltip>
          }
        >
          {row.isActive ? (
            <a
              className="btn btn-icon delete-button"
              onClick={() => openDeleteFormDialog(row.Id, row.isActive)}
            >
              <span className="svg-icon svg-icon-md svg-icon-danger">
                <SVG src={toAbsoluteUrl("/media/svg/icons/General/disable.svg")} />
              </span>
            </a>
          ) : (
            <a
              className="btn btn-icon btn-light btn-hover-success btn-sm mx-1"
              onClick={() => openActiveFormDialog(row.Id, row.isActive)}
            >
              <span className="svg-icon svg-icon-md svg-icon-success">A</span>
            </a>
          )}
        </OverlayTrigger>
      )}


      {/* Reopening */}
      {isAccessForEdit && row?.jobPostingStatus == 3 && (
        <OverlayTrigger overlay={<Tooltip id={`edit-tooltip-${row.Id}`}>Reopen</Tooltip>}>
          <a
            className="btn btn-icon posting-button"
            onClick={() => openEditFormDialog(row.Id)}
          >
            <span className="svg-icon svg-icon-md svg-icon-primary">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")} />
            </span>
          </a>
        </OverlayTrigger>
      )}

    </div>

  );
}
