import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";

export function ActionsColumnFormatter2(
  cellContent,
  row,
  rowIndex,

  {
    newButtonClick,
    isAccessForCreate,
    setEmployeeId,
    openEditDialog,
    openDeleteDialog,
    openReadDialog,
    isAccessForEdit,
    isAccessForDelete,
    isAccessForRead,
  },
) {
  return (
    <>
      {!row?.isAppraisalReview ? (
        <div className="space-x-2">
          {isAccessForCreate && row?.isActive && (
            <OverlayTrigger
              overlay={<Tooltip id="products-edit-tooltip">Create</Tooltip>}
            >
              <span
                title=""
                className=""
                onClick={() => {
                  setEmployeeId(row?.Id);
                  newButtonClick();
                }}
              >
                <Plus className="w-4 h-4 text-black cursor-pointer" />
              </span>
            </OverlayTrigger>
          )}
        </div>
      ) : (
        <div className="space-x-2">
          {isAccessForRead && row?.isActive && (
            <OverlayTrigger
              overlay={<Tooltip id="products-edit-tooltip">View</Tooltip>}
            >
              <span
                title=""
                className=""
                onClick={() => openReadDialog(row?.appraisalReviewId)}
              >
                <Eye className="w-4 h-4 text-black cursor-pointer" />
              </span>
            </OverlayTrigger>
          )}
          {isAccessForEdit &&
            row?.isActive &&
            !row?.isFinalize &&
            !row?.isPortalFinalize && (
              <OverlayTrigger
                overlay={<Tooltip id="products-edit-tooltip">Edit</Tooltip>}
              >
                <span
                  title=""
                  className=""
                  onClick={() => openEditDialog(row?.appraisalReviewId)}
                >
                  <Pencil className="w-4 h-4 text-black cursor-pointer" />
                </span>
              </OverlayTrigger>
            )}
          {isAccessForDelete &&
            row?.isActive &&
            !row?.isFinalize &&
            !row?.isPortalFinalize && (
              <OverlayTrigger
                overlay={<Tooltip id="products-edit-tooltip">Delete </Tooltip>}
              >
                <span
                  title=""
                  className=""
                  onClick={() => openDeleteDialog(row?.appraisalReviewId)}
                >
                  <Trash2 className="w-4 h-4 text-black cursor-pointer" />
                </span>
              </OverlayTrigger>
            )}
        </div>
      )}
    </>
  );
}
