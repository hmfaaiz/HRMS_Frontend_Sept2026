import React from "react";
import SVG from "react-inlinesvg";
import { useSelector, shallowEqual, useDispatch } from "react-redux"
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { updateUserAccess } from "../../../../_redux/redux-Actions";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,

  {
    openEditFormDialog,
    openDeleteFormDialog,
    openActiveFormDialog,
    openReadUserDialog,
    isAccessForEdit,
    isAccessForDelete,
    openReadFormDialog,
    setIds,
    setIsFileReq, isForDelete,dispatch
  }
) {
  const isUserRead = false;


// const dispatch = useDispatch();

  // console.log("aaa111a1111",activeFiscalYear)
  return (
    <>
      {row.isForRead && (

        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">View</Tooltip>}>
          <a
            title=""
            className="btn btn-icon  btn-hover-primary btn-sm mx-3 view-button"
            onClick={() => {
              setIds(row.Id);
              dispatch(updateUserAccess("read"))
            }}
          >
            <span className="svg-icon svg-icon-md svg-icon-primary">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/Communication/view.svg")}
              />
            </span>
          </a>
        </OverlayTrigger>

      )}


      {row.isAccessForEdit && row.isActive && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Edit</Tooltip>}
        >
          <a
            title=""
            className="btn btn-icon edit-button"
            onClick={() => {
              setIds(row.Id);
              //  dispatch(updateUserAccess("edit"))
            }}
          >
            <span className="svg-icon svg-icon-md svg-icon-primary">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}
              />
            </span>
          </a>
        </OverlayTrigger>
      )}



      {row.isForDelete && (
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
              className="btn btn-icon  delete-button"
              onClick={() => openDeleteFormDialog(row.Id, row.isActive)}
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
              onClick={() => openActiveFormDialog(row.Id, row.isActive)}
            >
              <span className="svg-icon svg-icon-md svg-icon-success">A</span>
            </a>
          )}
        </OverlayTrigger>
      )}
    </>
  );
}
