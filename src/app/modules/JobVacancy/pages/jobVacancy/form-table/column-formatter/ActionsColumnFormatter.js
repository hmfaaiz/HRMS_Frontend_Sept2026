import React from "react";
import SVG from "react-inlinesvg";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { ArrowUpRight, CirclePause, CirclePower, CircleX, Eye, Pencil, ScreenShare, Trash2 } from "lucide-react";

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
    isAccessForView,
    isAccessForDelete,
    openReadFormDialog,

    isAccessForPosting,
    isAccessForHold,
    isAccessForClose,
    openPostingFormDialog,
    openHoldFormDialog,
    openCloseFormDialog,
  }
) {
  const isUserRead = false;
  return (

    <div className="space-x-2">
      {/* Post */}
      {isAccessForPosting && !row.isRequisitionForm &&
        (row?.jobPostingStatus == 0 || row?.jobPostingStatus == 2) && (
          <OverlayTrigger
            overlay={<Tooltip id="post-tooltip">Post Job Vacancy</Tooltip>}
          >
            <a
              className=""
              onClick={() => openPostingFormDialog(row.Id)}
            >
              <span className="">
                {/* <SVG
                  src={toAbsoluteUrl(
                    "/media/svg/icons/Communication/vacancyPost.svg"
                  )}
                /> */}
                <ArrowUpRight className="w-5 h-5"/>
              </span>
            </a>
          </OverlayTrigger>
        )}

      {/* Hold */}
      {isAccessForHold && !row.isRequisitionForm  && row?.jobPostingStatus == 1 && (
        <OverlayTrigger
          overlay={<Tooltip id="hold-tooltip">Hold Job Vacancy</Tooltip>}
        >
          <a
            className=" "
            onClick={() => openHoldFormDialog(row.Id)}
          >
            <span className="">
              {/* <SVG
                src={toAbsoluteUrl(
                  "/media/svg/icons/Communication/vacancyHold.svg"
                )}
              /> */}
              <CirclePause className="w-4 h-4"/>
            </span>
          </a>
        </OverlayTrigger>
      )}

      {/* Close */}
      {isAccessForClose  && !row.isRequisitionForm &&
        (row?.jobPostingStatus == 1 || row?.jobPostingStatus == 2) && (
          <OverlayTrigger
            overlay={<Tooltip id="close-tooltip">Close Job Vacancy</Tooltip>}
          >
            <a
              className=""
              onClick={() => openCloseFormDialog(row.Id)}
            >
              <span className="">
                {/* <SVG
                  src={toAbsoluteUrl(
                    "/media/svg/icons/Communication/vacancyClose.svg"
                  )}
                /> */}
                <CircleX className="w-4 h-4"/>
              </span>
            </a>
          </OverlayTrigger>
        )}

      {/* View */}
      {isAccessForView &&(
        <OverlayTrigger overlay={<Tooltip id="view-tooltip">View</Tooltip>}>
          <a className="" onClick={() => openReadFormDialog(row.Id)}>
            <Eye className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}

      {/* Edit */}
      {isAccessForEdit && !row?.jobPostingStatus && (
        <OverlayTrigger
          overlay={<Tooltip id={`edit-tooltip-${row.Id}`}>Edit</Tooltip>}
        >
          <a className="" onClick={() => openEditFormDialog(row.Id)}>
            <Pencil className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}

      {/* Delete or Activate */}
      {isAccessForDelete && !row?.jobPostingStatus && (
        <OverlayTrigger
          overlay={
            <Tooltip id="delete-tooltip">
              {row.isActive ? "Delete" : "Mark Active"}
            </Tooltip>
          }
        >
          {row.isActive ? (
            <a
              className=""
              onClick={() => openDeleteFormDialog(row.Id, row.isActive)}
            >
              <Trash2 className="w-4 h-4 text-black cursor-pointer" />
            </a>
          ) : (
            <a
              className=""
              onClick={() => openActiveFormDialog(row.Id, row.isActive)}
            >
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
          {/* <a
            className="btn btn-icon posting-button"
            onClick={() => openEditFormDialog(row.Id)}
          >
            <span className="svg-icon svg-icon-md svg-icon-primary">
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}
              />
            </span>
          </a> */}
             <a className="" onClick={() => openEditFormDialog(row.Id)}>
            <Pencil className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}
    </div>
  );
}
