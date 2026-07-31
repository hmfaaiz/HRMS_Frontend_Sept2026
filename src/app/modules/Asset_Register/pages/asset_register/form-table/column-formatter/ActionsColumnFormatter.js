import React from "react";
import SVG from "react-inlinesvg";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye, FileClock, FileCog, Pencil, Trash2, View } from "lucide-react";
import { getUploadUrl } from "../../../../../../utils/common";

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
    isAccessForRead, openReadAssetHistoryDialog, openReadAssetAssessmentDialog,
  }
) {
  const isUserRead = false;
  return (
    <div className="space-x-2">



      {isAccessForRead && row.isPresent == 1 && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Asset History</Tooltip>}
        >
          <a onClick={() => openReadAssetHistoryDialog(row.Id, isUserRead)}>
            <FileClock className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}

      {isAccessForRead && row.isAssessmentExist == 1 && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Asset Assessment</Tooltip>}
        >
          <a onClick={() => openReadAssetAssessmentDialog(row.Id, isUserRead)}>
            <FileCog className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}

      {isAccessForRead && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">View</Tooltip>}
        >
          <a onClick={() => openReadFormDialog(row.Id, isUserRead)}>
            <Eye className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}
      {isAccessForEdit && row.status != 2 && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Edit</Tooltip>}
        >
          <a onClick={() => openEditFormDialog(row.Id)}>
            <Pencil className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}

      {isAccessForDelete && !row.isPresent && row.status != 2 && (
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
      )}
    </div>
  );
}
