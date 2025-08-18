import React from "react";
import SVG from "react-inlinesvg";
import { shallowEqual, useSelector } from "react-redux";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Generatejob_offer_letter } from "../../../../_redux/redux-Actions";
import { CirclePower, Download, Eye, Pencil, Send, Trash2 } from "lucide-react";
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
  }
) {
  const isUserRead = false;

  return (
    <div className="space-x-2">
      {isAccessForConvert && row.isToConvertToEmployee && (
        <OverlayTrigger
          overlay={
            <Tooltip id="emp-convert-tooltip">Convert to Employee</Tooltip>
          }
        >
          <a className="" onClick={() => openConvertFormDialog(row.Id)}>
            {/* <span className="svg-icon svg-icon-md svg-icon-primary">
              <SVG
                src={toAbsoluteUrl(
                  "/media/svg/icons/Communication/vacancyPost.svg"
                )}
              />
            </span> */}
            <Send className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}

      {isAccessForOfferLetter && row.isToShowOfferLetter && (
        <OverlayTrigger
          overlay={
            <Tooltip id="emp-letter-tooltip">Download Offer Letter</Tooltip>
          }
        >
          <a
            disabled={pdfGenerateLoading}
            className=""
            onClick={() => {
              dispatch(Generatejob_offer_letter(row.Id));
            }}
          >
            <Download className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}

      {/* View */}
      {isAccessForView && (
        <OverlayTrigger overlay={<Tooltip id="view-tooltip">View</Tooltip>}>
          <a className="" onClick={() => openReadFormDialog(row.Id)}>
            <Eye className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}

      {/* Edit */}
      {isAccessForEdit && !row?.jobPostingStatus && row.isToUpdateDelete && (
        <OverlayTrigger
          overlay={<Tooltip id={`edit-tooltip-${row.Id}`}>Edit</Tooltip>}
        >
          <a onClick={() => openEditFormDialog(row.Id)}>
            <Pencil className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}

      {/* Delete or Activate */}
      {isAccessForDelete && !row?.jobPostingStatus && row.isToUpdateDelete && (
        <OverlayTrigger
          overlay={
            <Tooltip id="delete-tooltip">
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

      {/* Reopening */}
      {isAccessForEdit && row?.jobPostingStatus == 3 && (
        <OverlayTrigger
          overlay={<Tooltip id={`edit-tooltip-${row.Id}`}>Reopen</Tooltip>}
        >
          <a
            className="btn btn-icon posting-button"
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
    </div>
  );
}
