import React from "react";
import SVG from "react-inlinesvg";
import { shallowEqual, useSelector } from "react-redux";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Generatejob_offer_letter } from "../../../../_redux/redux-Actions";
import { CirclePower, Download, Eye, Pencil, Plus, Send, Trash2 } from "lucide-react";
export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  {
    dispatch,
    pdfGenerateLoading,
    openEditFormDialog,
    openDeleteFormDialog,
    openActiveFormDialog,
    openConvertFormDialog,
    openReadFormDialog,
    isAccessForEdit,
    isAccessForView,
    isAccessForDelete,
    isAccessForConvert,
    isAccessForOfferLetter,
    newFormButtonClick,
    isAccessForCreate,
  },
) {
  const isUserRead = false;

  return (
    <div className="space-x-2">
      {/* View */}
      {isAccessForView && (
        <OverlayTrigger overlay={<Tooltip id="view-tooltip">View</Tooltip>}>
          <button
            style={{ background: "none", border: "none", padding: 0 }}
            type="button"
            className=""
            onClick={() => openReadFormDialog(row.employeeId)}
          >
            <Eye className="w-4 h-4 text-black cursor-pointer" />
          </button>
        </OverlayTrigger>
      )}

      {/* Edit */}
      {isAccessForEdit && !row.settlementFinalized && (
        <OverlayTrigger
          overlay={
            <Tooltip id={`edit-tooltip-${row.employeeId}`}>Edit</Tooltip>
          }
        >
          <button
            style={{ background: "none", border: "none", padding: 0 }}
            type="button"
            onClick={() => openEditFormDialog(row.employeeId)}
          >
            <Pencil className="w-4 h-4 text-black cursor-pointer" />
          </button>
        </OverlayTrigger>
      )}

      {isAccessForCreate && (
        <OverlayTrigger
          overlay={
            <Tooltip id={`edit-tooltip-${row.employeeId}`}>Create</Tooltip>
          }
        >
          <button
            style={{ background: "none", border: "none", padding: 0 }}
            type="button"
            onClick={() => newFormButtonClick(row.employeeId)}
          >
            <Plus className="w-4 h-4 text-black cursor-pointer" />
          </button>
        </OverlayTrigger>
      )}

      {/* Delete or Activate */}
      {isAccessForDelete && !row.settlementFinalized && (
        <OverlayTrigger
          overlay={
            <Tooltip id="delete-tooltip">
              {row.isActive ? "Delete" : "Mark Active"}
            </Tooltip>
          }
        >
          {row.isActive ? (
            <button
              style={{ background: "none", border: "none", padding: 0 }}
              type="button"
              onClick={() => openDeleteFormDialog(row.employeeId, row.isActive)}
            >
              <Trash2 className="w-4 h-4 text-black cursor-pointer" />
            </button>
          ) : (
            <button
              style={{ background: "none", border: "none", padding: 0 }}
              type="button"
              onClick={() => openActiveFormDialog(row.employeeId, row.isActive)}
            >
              <CirclePower className="w-4 h-4 text-black cursor-pointer" />
            </button>
          )}
        </OverlayTrigger>
      )}
    </div>
  );
}
