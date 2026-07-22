import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye, FileText, Pencil, Plus, Trash2 } from "lucide-react";

export function ActionsColumnFormatter2(
  cellContent,
  row,
  rowIndex,
  {
    newButtonClick,
    isAccessForCreate,
    setEmployeeId,
    appraisalFinalizationBeforeCreation,
    dispatch,
    beforeCreation,
    appraisalCategoryId,
    openEditDialog,
    openDeleteDialog,
    openReadDialog,
    isAccessForEdit,
    isAccessForDelete,
    isAccessForRead,
    downloadAppraisalFinalizationPdf,
    finalizationPdfLoading,
  },
) {
  return (
    <>
      {!row?.isAppraisalReview ? (
        <div className="space-x-2">
          {dispatch && appraisalFinalizationBeforeCreation && (
            <OverlayTrigger
              overlay={
                <Tooltip id={`fin-pdf-tooltip-${row.Id}`}>
                  Appraisal Finalization Report
                </Tooltip>
              }
            >
              <span
                onClick={() =>
                  !beforeCreation &&
                  dispatch(
                    appraisalFinalizationBeforeCreation({
                      Id: row.Id,
                      subsidiaryId: row?.subsidiaryId,
                      appraisalCategoryId,
                    }),
                  )
                }
                style={{
                  cursor: beforeCreation  || finalizationPdfLoading ? "not-allowed" : "pointer",
                  opacity: beforeCreation || finalizationPdfLoading ? 0.5 : 1,
                }}
              >
                <FileText className="w-4 h-4 text-black cursor-pointer" />
              </span>
            </OverlayTrigger>
          )}

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
          {dispatch && downloadAppraisalFinalizationPdf && (
            <OverlayTrigger
              overlay={
                <Tooltip id={`fin-pdf-tooltip-${row.Id}`}>
                  Appraisal Finalization Report
                </Tooltip>
              }
            >
              <span
                onClick={() =>
                  !finalizationPdfLoading &&
                  dispatch(downloadAppraisalFinalizationPdf(row.appraisalReviewId))
                }
                style={{
                  cursor: finalizationPdfLoading || beforeCreation ? "not-allowed" : "pointer",
                  opacity: finalizationPdfLoading || beforeCreation ? 0.5 : 1,
                }}
              >
                <FileText className="w-4 h-4 text-black cursor-pointer" />
              </span>
            </OverlayTrigger>
          )}

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
          {isAccessForEdit && row?.isActive && !row?.isFinalize && (
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
          {isAccessForDelete && row?.isActive && !row?.isFinalize && (
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
