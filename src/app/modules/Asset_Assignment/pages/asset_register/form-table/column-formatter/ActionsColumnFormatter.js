import React from "react";
import SVG from "react-inlinesvg";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye, Pencil, Trash2, UserRoundX, View } from "lucide-react";
import { getUploadUrl } from "../../../../../../utils/common";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,

  {
    openEditFormDialog,
    openDeleteFormDialog,
    openUnassignFormDialog,
    isAccessForEdit,
    isAccessForDelete,
    openReadFormDialog,
    isAccessForRead, isAccessForUnassign
  }
) {
  const isUserRead = false;
  return (
    <div className="space-x-2">

      {/* {isAccessForRead && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">View</Tooltip>}
        >
          <a onClick={() => openReadFormDialog(row.Id, isUserRead)}>
            <Eye className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )} */}
      {/* {isAccessForEdit && (
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
          {
            <a onClick={() => openDeleteFormDialog(row.Id, row.isActive)}>
              <Trash2 className="w-4 h-4 text-black cursor-pointer" />
            </a>
          }
        </OverlayTrigger>
      )} */}


      {isAccessForUnassign && row.status === "1" ? (
        <OverlayTrigger
          overlay={
            <Tooltip id="products-edit-tooltip">
              Unassign
            </Tooltip>
          }
        >
          <a onClick={() => openUnassignFormDialog(row.Id)}>
            <UserRoundX className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      ) : (
        "-"
      )}
    </div>
  );
}
