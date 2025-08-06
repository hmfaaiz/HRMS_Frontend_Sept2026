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
    // <div className="d-flex flex-nowrap align-items-center">

    //   {/* posting */}
    //   <OverlayTrigger
    //     overlay={<Tooltip id="products-edit-tooltip">Post</Tooltip>}>
    //     <a
    //       title=""
    //       className="btn btn-icon  btn-hover-primary btn-sm mx-1 view-button"
    //       onClick={() => openPostingFormDialog(row.Id, isAccessForPosting)}
    //     >
    //       <span className="svg-icon svg-icon-md svg-icon-primary">
    //         <SVG
    //           src={toAbsoluteUrl("/media/svg/icons/Communication/vacancyPost.svg")}
    //         />
    //       </span>
    //     </a>
    //   </OverlayTrigger>

    //   {/* hold */}
    //   <OverlayTrigger
    //     overlay={<Tooltip id="products-edit-tooltip">Hold</Tooltip>}>
    //     <a
    //       title=""
    //       className="btn btn-icon  btn-hover-primary btn-sm mx-1 view-button"
    //       onClick={() => openHoldFormDialog(row.Id, isAccessForHold)}
    //     >
    //       <span className="svg-icon svg-icon-md svg-icon-primary">
    //         <SVG
    //           src={toAbsoluteUrl("/media/svg/icons/Communication/vacancyHold.svg")}
    //         />
    //       </span>
    //     </a>
    //   </OverlayTrigger>

    //   {/* close */}
    //   <OverlayTrigger
    //     overlay={<Tooltip id="products-edit-tooltip">Close</Tooltip>}>
    //     <a
    //       title=""
    //       className="btn btn-icon  btn-hover-primary btn-sm mx-1 view-button"
    //       onClick={() => openCloseFormDialog(row.Id, isAccessForClose)}
    //     >
    //       <span className="svg-icon svg-icon-md svg-icon-primary">
    //         <SVG
    //           src={toAbsoluteUrl("/media/svg/icons/Communication/vacancyClose.svg")}
    //         />
    //       </span>
    //     </a>
    //   </OverlayTrigger>

    //   {/* view */}
    //   <OverlayTrigger
    //     overlay={<Tooltip id="products-edit-tooltip">View</Tooltip>}>
    //     <a
    //       title=""
    //       className="btn btn-icon  btn-hover-primary btn-sm mx-1 view-button"
    //       onClick={() => openReadFormDialog(row.Id, isUserRead)}
    //     >
    //       <span className="svg-icon svg-icon-md svg-icon-primary">
    //         <SVG
    //           src={toAbsoluteUrl("/media/svg/icons/Communication/view.svg")}
    //         />
    //       </span>
    //     </a>
    //   </OverlayTrigger>

    //   {/* edit */}
    //   <OverlayTrigger
    //     overlay={<Tooltip id={`edit-tooltip-${row.Id}`}>Edit</Tooltip>}
    //   >
    //     <>
    //       {isAccessForEdit && row?.isActive && (
    //         <a
    //           title="Edit"
    //           className="btn btn-icon btn-hover-primary btn-sm mx-1 edit-button"
    //           onClick={() => openEditFormDialog(row.Id)}
    //         >
    //           <span className="svg-icon svg-icon-md svg-icon-primary">
    //             <SVG
    //               src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}
    //             />
    //           </span>
    //         </a>
    //       )}
    //     </>
    //   </OverlayTrigger>

    //   {/* delete */}
    //   <OverlayTrigger
    //     overlay={
    //       <Tooltip id="products-edit-tooltip">
    //         {row.isActive ? "Delete" : "Mark Active"}
    //       </Tooltip>
    //     }
    //   >
    //     <>
    //       {isAccessForDelete && (
    //         row.isActive ? (
    //           <a
    //             title=""
    //             className="btn btn-icon btn-hover-danger btn-sm mx-1 delete-button"
    //             onClick={() => openDeleteFormDialog(row.Id, row.isActive)}
    //           >
    //             <span className="svg-icon svg-icon-md svg-icon-danger">
    //               <SVG
    //                 src={toAbsoluteUrl("/media/svg/icons/General/disable.svg")}
    //                 title=""
    //               />
    //             </span>
    //           </a>
    //         ) : (
    //           <a
    //             title=""
    //             className="btn btn-icon btn-light btn-hover-success btn-sm mx-1"
    //             onClick={() => openActiveFormDialog(row.Id, row.isActive)}
    //           >
    //             <span className="svg-icon svg-icon-md svg-icon-success">A</span>
    //           </a>
    //         )
    //       )}
    //     </>
    //   </OverlayTrigger>

    // </div>

    <div className="space-x-2">
      {/* Post */}
      {isAccessForPosting &&
        (row?.jobPostingStatus == 0 || row?.jobPostingStatus == 2) && (
          <OverlayTrigger
            overlay={<Tooltip id="post-tooltip">Post Job Vacancy</Tooltip>}
          >
            <a
              className="btn btn-icon posting-button"
              onClick={() => openPostingFormDialog(row.Id)}
            >
              <span className="svg-icon svg-icon-md svg-icon-primary">
                <SVG
                  src={toAbsoluteUrl(
                    "/media/svg/icons/Communication/vacancyPost.svg"
                  )}
                />
              </span>
            </a>
          </OverlayTrigger>
        )}

      {/* Hold */}
      {isAccessForHold && row?.jobPostingStatus == 1 && (
        <OverlayTrigger
          overlay={<Tooltip id="hold-tooltip">Hold Job Vacancy</Tooltip>}
        >
          <a
            className="btn btn-icon posting-button"
            onClick={() => openHoldFormDialog(row.Id)}
          >
            <span className="svg-icon svg-icon-md svg-icon-primary">
              <SVG
                src={toAbsoluteUrl(
                  "/media/svg/icons/Communication/vacancyHold.svg"
                )}
              />
            </span>
          </a>
        </OverlayTrigger>
      )}

      {/* Close */}
      {isAccessForClose &&
        (row?.jobPostingStatus == 1 || row?.jobPostingStatus == 2) && (
          <OverlayTrigger
            overlay={<Tooltip id="close-tooltip">Close Job Vacancy</Tooltip>}
          >
            <a
              className="btn btn-icon posting-button"
              onClick={() => openCloseFormDialog(row.Id)}
            >
              <span className="svg-icon svg-icon-md svg-icon-primary">
                <SVG
                  src={toAbsoluteUrl(
                    "/media/svg/icons/Communication/vacancyClose.svg"
                  )}
                />
              </span>
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
