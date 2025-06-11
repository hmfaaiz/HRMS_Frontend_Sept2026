import React from "react";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,

  {
    openEditFormDialog,
    openDeleteFormDialog,
    openReadFormDialog,
    openEmailFormDialog,
    isAccessForEdit,
    isAccessForView,
    isAccessForDelete,
    isAccessForEmail,
  }
) {
  const isUserRead = false;
  return (
    <>
      {isAccessForView && row.isActive && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">View</Tooltip>}
        >
          <a
            title=""
            className="btn btn-icon  btn-hover-primary btn-sm mx-3 view-button"
            onClick={() => openReadFormDialog(row.Id, isUserRead)}
          >
            <span className="svg-icon svg-icon-md svg-icon-primary">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/Communication/view.svg")}
              />
            </span>
          </a>
        </OverlayTrigger>
      )}
      {isAccessForEdit && row.isActive && rowIndex === 0 && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Edit</Tooltip>}
        >
          <a
            title=""
            className="btn btn-icon btn-hover-primary btn-sm mx-3 edit-button"
            onClick={() => openEditFormDialog(row.Id)}
          >
            <span className="svg-icon svg-icon-md svg-icon-primary">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}
              />
            </span>
          </a>
        </OverlayTrigger>
      )}
      {isAccessForEmail &&
        row.isActive &&
         rowIndex === 0 && (
          <OverlayTrigger
            overlay={<Tooltip id="products-edit-tooltip">Send Email</Tooltip>}
          >
            <a
              title=""
              className="btn btn-icon  btn-hover-primary btn-sm mx-3 view-button"
              onClick={() => openEmailFormDialog(row.Id)}
            >
              <span className="svg-icon svg-icon-md svg-icon-primary">
                <SVG
                  src={toAbsoluteUrl(
                    "/media/svg/icons/Communication/schedule.svg"
                  )}
                />
              </span>
            </a>
          </OverlayTrigger>
        )}
      {isAccessForDelete  && rowIndex === 0 && (
        <OverlayTrigger
          overlay={
            <Tooltip id="products-edit-tooltip">
              {row.isActive ? "Delete" : "Mark Active"}
            </Tooltip>
          }
        >
          <a
            title=""
            className="btn btn-icon btn-hover-danger btn-sm mx-3 delete-button"
            onClick={() => openDeleteFormDialog(row.Id, row.isActive)}
          >
            <span className="svg-icon svg-icon-md svg-icon-danger">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/General/disable.svg")}
                title=""
              />
            </span>
          </a>
        </OverlayTrigger>
      )}
    </>
  );
}
