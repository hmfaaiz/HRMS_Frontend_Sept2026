import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { CirclePower, Pencil, Trash2, ListCollapse, BookCheck, Calculator } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  {
    openEditFormDialog,
    openDeleteFormDialog,
    openActiveFormDialog,
    isAccessForEdit,
    isAccessForDelete,
    setIds,
    setIsFileReq,
    dispatch,
    pdfDownloading,
    completionPdfLoading,
    downloadLoanPdf,
    downloadLoanCompletionPdf,
    showDetails, openInstallmentDetails
  }
) {
  // Loan is "Completed" when approved AND isLoanContinuing is false
  const isCompleted = row.approved_status === 1 && !row.isLoanContinuing;

  return (
    <div className="space-x-2 d-flex align-items-center justify-content-end">

      {/* ── Loan Completion Report (only for completed loans) ── */}
      {isCompleted && (
        <OverlayTrigger
          overlay={<Tooltip id={`book-check-tooltip-${row.Id}`}>Loan Completion Report</Tooltip>}
        >
          <a
            onClick={() => !completionPdfLoading && dispatch(downloadLoanCompletionPdf(row.Id))}
            style={{
              cursor: completionPdfLoading ? "not-allowed" : "pointer",
              opacity: completionPdfLoading ? 0.5 : 1,
            }}
          >
            <BookCheck className="w-4 h-4 text-black" />
          </a>
        </OverlayTrigger>
      )}

      {/* ── Loan Detail Report (always visible) ── */}
      <OverlayTrigger
        overlay={<Tooltip id={`list-collapse-tooltip-${row.Id}`}>Loan Detail Report</Tooltip>}
      >
        <a
          onClick={() => !pdfDownloading && dispatch(downloadLoanPdf(row.Id))}
          style={{
            cursor: pdfDownloading ? "not-allowed" : "pointer",
            opacity: pdfDownloading ? 0.5 : 1,
          }}
        >
          <ListCollapse className="w-4 h-4 text-black" />
        </a>
      </OverlayTrigger>

      {/* ── Edit ── */}
      {isAccessForEdit && row.isActive && row?.isLoanContinuing && (
        <OverlayTrigger overlay={<Tooltip id={`edit-tooltip-${row.Id}`}>Edit</Tooltip>}>
          <a onClick={() => setIds(row.Id)} style={{ cursor: "pointer" }}>
            <Pencil className="w-4 h-4 text-black" />
          </a>
        </OverlayTrigger>
      )}

      {/* ── Delete / Activate ── */}
      {isAccessForDelete && (
        <OverlayTrigger
          overlay={
            <Tooltip id={`delete-tooltip-${row.Id}`}>
              {row.isActive ? "Delete" : "Mark Active"}
            </Tooltip>
          }
        >
          {row.isActive ? (
            <a onClick={() => openDeleteFormDialog(row.Id, row.isActive)} style={{ cursor: "pointer" }}>
              <Trash2 className="w-4 h-4 text-black" />
            </a>
          ) : (
            <a onClick={() => openActiveFormDialog(row.Id, row.isActive)} style={{ cursor: "pointer" }}>
              <CirclePower className="w-4 h-4 text-black" />
            </a>
          )}
        </OverlayTrigger>
      )}

      {isAccessForEdit && (
        <OverlayTrigger
          overlay={
            <Tooltip id={`delete-tooltip-${row.Id}`}>
              {"Edit Detail"}
            </Tooltip>
          }
        >

          <a onClick={() => openInstallmentDetails(row.Id)} style={{ cursor: "pointer" }}>
            <Calculator className="w-4 h-4 text-black" />
          </a>

        </OverlayTrigger>
      )}

    </div>
  );
}