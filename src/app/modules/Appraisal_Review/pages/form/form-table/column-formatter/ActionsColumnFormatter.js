import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye, Pencil, Trash2, FileText } from "lucide-react";
 
export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,

  {
    openEditDialog,
    openDeleteDialog,
    openReadDialog,
    isAccessForEdit,
    isAccessForDelete,
    isAccessForRead,
    dispatch,
    downloadAppraisalFinalizationPdf,
    finalizationPdfLoading,
  }
) {
  return (
    <div className="space-x-2">
 
      {row?.isFinalize && dispatch && downloadAppraisalFinalizationPdf && (
        <OverlayTrigger
          overlay={
            <Tooltip id={`fin-pdf-tooltip-${row.Id}`}>
              Appraisal Finalization Report
            </Tooltip>
          }
        >
          <a
            onClick={() =>
              !finalizationPdfLoading &&
              dispatch(downloadAppraisalFinalizationPdf(row.Id))
            }
            style={{
              cursor: finalizationPdfLoading ? "not-allowed" : "pointer",
              opacity: finalizationPdfLoading ? 0.5 : 1,
            }}
          >
            <FileText className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}
 
      {isAccessForRead && row?.isActive && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">View</Tooltip>}
        >
          <a title="" className="" onClick={() => openReadDialog(row?.Id)}>
            <Eye className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}
       {isAccessForEdit && row?.isActive && !row?.isFinalize && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Edit</Tooltip>}
        >
          <a title="" className="" onClick={() => openEditDialog(row?.Id)}>
            <Pencil className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )} 
      {isAccessForDelete && row?.isActive && !row?.isFinalize && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Delete </Tooltip>}
        >
          <a title="" className="" onClick={() => openDeleteDialog(row?.Id)}>
            <Trash2 className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}
    </div>
  );
}
