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
    openEditFormDialog,
    openDeleteFormDialog,
    openActiveFormDialog,
    openReadUserDialog,
    isAccessForEdit,
    isAccessForDelete,
    openReadFormDialog,
  }
) {
  const isUserRead = false;
  return (
    <div className="space-x-2">
      <OverlayTrigger
        overlay={<Tooltip id="products-edit-tooltip">View</Tooltip>}
      >
        <a onClick={() => openReadFormDialog(row.Id, isUserRead)}>
          <Eye className="w-4 h-4 text-black cursor-pointer" />
        </a>
      </OverlayTrigger>
      {isAccessForEdit && row.isActive && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Edit</Tooltip>}
        >
          <a onClick={() => openEditFormDialog(row.Id)}>
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
            <a onClick={() => openDeleteFormDialog(row.Id, row.isActive)}>
              <Trash2 className="w-4 h-4 text-black cursor-pointer" />
            </a>
          ) : (
            <a onClick={() => openActiveFormDialog(row.Id, row.isActive)}>
              <CirclePower className="w-4 h-4 text-black cursor-pointer" />
            </a>
          )}
        </OverlayTrigger>
      )}
    </div>
  );
}
