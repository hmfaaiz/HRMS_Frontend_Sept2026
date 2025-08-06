import React from "react";
import SVG from "react-inlinesvg";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye, Pencil, Trash2 } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,

  {
    openEditDesignationDialog,
    openDeleteDesignationDialog,
    openActiveBankDialog,
    openReadUserDialog,
    isAccessForEdit,
    isAccessForDelete,
    openReadDesignationDialog,
    isAccessForRead,
  }
) {
  const isUserRead = false;
  return (
    <div className="space-x-2">
      {isAccessForRead && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">View</Tooltip>}
        >
          <a
            title=""
            className=""
            onClick={() => openReadDesignationDialog(row.Id, isUserRead)}
          >
            <Eye className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}
      {isAccessForEdit && row.isActive && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Edit</Tooltip>}
        >
          <a
            title=""
            className=""
            onClick={() => openEditDesignationDialog(row.Id)}
          >
            <Pencil className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}

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
              onClick={() => openDeleteDesignationDialog(row.Id, row.isActive)}
            >
              <Trash2 className="w-4 h-4 text-black cursor-pointer" />
            </a>
          ) : (
            <div></div>
            // <a
            //   title=""
            //   className="btn btn-icon btn-light btn-hover-success btn-sm mx-3"
            //   onClick={() => openActiveBankDialog(row.Id, row.isActive)}
            // >
            //   <span className="svg-icon svg-icon-md svg-icon-success">A</span>
            // </a>
          )}
        </OverlayTrigger>
      )}
    </div>
  );
}
