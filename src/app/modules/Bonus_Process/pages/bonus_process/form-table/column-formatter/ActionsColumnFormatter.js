import React from "react";
import SVG from "react-inlinesvg";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  {
    openEditFormDialog,
    openDeleteFormDialog,
    isAccessForEdit,
    isAccessForDelete,
    setIds,
  }
) {
  return (
    <>
      {isAccessForEdit && (
        <OverlayTrigger
          overlay={<Tooltip id="bonus-edit-tooltip">Edit</Tooltip>}
        >
          <a
            title=""
            className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
            onClick={() => setIds(row.Id)}
          >
            <span className="svg-icon svg-icon-md svg-icon-primary">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")} />
            </span>
          </a>
        </OverlayTrigger>
      )}

      {isAccessForDelete && (
        <OverlayTrigger
          overlay={<Tooltip id="bonus-delete-tooltip">Delete</Tooltip>}
        >
          <a
            title=""
            className="btn btn-icon btn-light btn-hover-danger btn-sm mx-3"
            onClick={() => openDeleteFormDialog(row.Id)}
          >
            <span className="svg-icon svg-icon-md svg-icon-danger">
              <SVG src={toAbsoluteUrl("/media/svg/icons/General/disable.svg")} />
            </span>
          </a>
        </OverlayTrigger>
      )}
    </>
  );
}