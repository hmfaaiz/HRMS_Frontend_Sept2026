import React from "react";
import SVG from "react-inlinesvg";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,

  {
    openEditDialog,
    openDeleteDialog,
    openReadDialog,
    openActiveDialog,
    isAccessForEdit,
    isAccessForDelete,
    isAccessForCreatingMultiple,
    openDuplicateDialog,
  }
) {
  const isUserRead = false;
  return (
    <>
      <OverlayTrigger
        overlay={<Tooltip id="products-edit-tooltip">View</Tooltip>}
      >
        <a
          title=""
          className="btn btn-icon view-button"
          onClick={() => openReadDialog(row.Id)}
        >
          <span className="svg-icon svg-icon-md svg-icon-primary">
            <SVG
              src={toAbsoluteUrl("/media/svg/icons/Communication/view.svg")}
            />
          </span>
        </a>
      </OverlayTrigger>
      {isAccessForEdit && row.isActive && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Edit</Tooltip>}
        >
          <a
            title=""
            className="btn btn-icon edit-button"
            onClick={() => openEditDialog(row.Id)}
          >
            <span className="svg-icon svg-icon-md svg-icon-primary">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}
              />
            </span>
          </a>
        </OverlayTrigger>
      )}

      <> </>

      {isAccessForDelete && row?.designationId !== null && (
        <OverlayTrigger
          overlay={
            <Tooltip id="products-edit-tooltip">
              {row.isActive ? "Delete" : "Mark Active"}
            </Tooltip>
          }
        >
          {row.isActive  ? (
            <a
              title=""
              className="btn btn-icon delete-button"
              onClick={() => openDeleteDialog(row.Id, row.isActive)}
            >
              <span className="svg-icon svg-icon-md svg-icon-danger">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/General/disable.svg")}
                  title=""
                />
              </span>
            </a>
          ) : (
            <a
              title=""
              className="btn btn-icon btn-light btn-hover-success btn-sm mx-3"
              onClick={() => openActiveDialog(row.Id, row.isActive)}
            >
              <span className="svg-icon svg-icon-md svg-icon-success">A</span>
            </a>
          )}
        </OverlayTrigger>
      )}

      {isAccessForCreatingMultiple && row?.designationId !== null && (
        <OverlayTrigger
          overlay={
            <Tooltip id="products-edit-tooltip">
              {row.isActive && "Duplicate"}
            </Tooltip>
          }
        >
          {row.isActive && (
            <a
              title=""
              className="btn btn-icon edit-button"
              onClick={() => openDuplicateDialog(row.Id)}
            >
              <span className="svg-icon svg-icon-md svg-icon-white">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/General/Duplicate.svg")}
                  title=""
                />
              </span>
            </a>
          )}
        </OverlayTrigger>
      )}
    </>
  );
}
