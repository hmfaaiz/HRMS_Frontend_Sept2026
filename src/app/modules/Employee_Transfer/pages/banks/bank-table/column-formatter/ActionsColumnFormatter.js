import React from "react";
import SVG from "react-inlinesvg";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { Modal, OverlayTrigger, Tooltip } from "react-bootstrap";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,

  {
    openEditBankDialog,
    openDeleteBankDialog,
    openActiveBankDialog,
    openReadUserDialog,
    isAccessForEdit,
    isAccessForDelete,
    openReadBankDialog,
    openEmpHistDialog
  }
) {



  const isUserRead = false;
  return (
    <>
      <OverlayTrigger
        overlay={<Tooltip id="products-edit-tooltip">History</Tooltip>}>
        <a
          title=""
          className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
          onClick={() => openEmpHistDialog(row.Id, isUserRead)}
        >
          <span className="svg-icon svg-icon-md svg-icon-primary">
            <SVG
              src={toAbsoluteUrl("/media/svg/icons/Text/Menu.svg")}
            />
          </span>
        </a>
      </OverlayTrigger>
      <OverlayTrigger
        overlay={<Tooltip id="products-edit-tooltip">View</Tooltip>}>
        <a
          title=""
          className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
          onClick={() => openReadBankDialog(row.Id, isUserRead)}
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
          overlay={<Tooltip id="products-edit-tooltip">Edit Transfer Info</Tooltip>}
        >
          <a
            title=""
            className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
            onClick={() => openEditBankDialog(row.Id)}
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

      {isAccessForDelete && (
        <OverlayTrigger
          overlay={
            <Tooltip id="products-edit-tooltip">
              {row.isActive ? "Delete" : "Mark Active"}
            </Tooltip>
          }
        >
          {row.isActive ? (
            <a
              title=""
              className="btn btn-icon btn-light btn-hover-danger btn-sm mx-3"
              onClick={() => openDeleteBankDialog(row.Id, row.isActive)}
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
              onClick={() => openActiveBankDialog(row.Id, row.isActive)}
            >
              <span className="svg-icon svg-icon-md svg-icon-success">A</span>
            </a>
          )}
        </OverlayTrigger>
      )}
    </>
  );
}
