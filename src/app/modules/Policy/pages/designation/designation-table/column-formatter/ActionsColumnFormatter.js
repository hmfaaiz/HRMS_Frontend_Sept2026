import React from "react";
import SVG from "react-inlinesvg";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { CirclePower, Eye, Pencil, Trash2 } from "lucide-react";

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
  }
) {
  const isUserRead = false;
  return (
    <div className="space-x-2">
      <OverlayTrigger
        overlay={<Tooltip id="products-edit-tooltip">View Policy</Tooltip>}
      >
        <a
          title=""
          className=""
          onClick={() => openReadDesignationDialog(row.Id, isUserRead)}
        >
          <Eye className="w-4 h-4 text-black cursor-pointer" />
        </a>
      </OverlayTrigger>
      {isAccessForEdit && row.isActive && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Edit Policy</Tooltip>}
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
              className=""
              onClick={() => openDeleteDesignationDialog(row.Id, row.isActive)}
            >
              <Trash2 className="w-4 h-4 text-black cursor-pointer" />
            </a>
          ) : (
            <a
              title=""
              className=""
              onClick={() => openActiveBankDialog(row.Id, row.isActive)}
            >
              <CirclePower className="w-4 h-4 text-black cursor-pointer" />
            </a>
          )}
        </OverlayTrigger>
      )}
    </div>
  );
}
