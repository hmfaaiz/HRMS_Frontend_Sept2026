// import React from "react";
// import SVG from "react-inlinesvg";
// import { shallowEqual, useDispatch, useSelector } from "react-redux";
// import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
// import { OverlayTrigger, Tooltip } from "react-bootstrap";
// import { CirclePower, Eye, Pencil, Trash2 } from "lucide-react";

// export function ActionsColumnFormatter(
//   cellContent,
//   row,
//   rowIndex,

//   {
//     openEditFormDialog,
//     openDeleteFormDialog,
//     openActiveFormDialog,
//     openReadUserDialog,
//     isAccessForEdit,
//     isAccessForDelete,
//     openReadFormDialog,
//     setIds,
//     setIsFileReq,
//   }
// ) {
//   const isUserRead = false;
//   return (
//     <div className="space-x-2">
//       {isAccessForEdit && row.isActive && row?.isLoanContinuing && (
//         <OverlayTrigger
//           overlay={<Tooltip id="products-edit-tooltip">Edit</Tooltip>}
//         >
//           <a
//             onClick={() => {
//               setIds(row.Id);
//             }}
//           >
//             <Pencil className="w-4 h-4 text-black cursor-pointer" />
//           </a>
//         </OverlayTrigger>
//       )}

//       <> </>

//       {isAccessForDelete && (
//         <OverlayTrigger
//           overlay={
//             <Tooltip id="products-edit-tooltip">
//               {row.isActive ? "Delete" : "Mark Active"}
//             </Tooltip>
//           }
//         >
//           {row.isActive ? (
//             <a onClick={() => openDeleteFormDialog(row.Id, row.isActive)}>
//               <Trash2 className="w-4 h-4 text-black cursor-pointer" />
//             </a>
//           ) : (
//             <a onClick={() => openActiveFormDialog(row.Id, row.isActive)}>
//               <CirclePower className="w-4 h-4 text-black cursor-pointer" />
//             </a>
//           )}
//         </OverlayTrigger>
//       )}
//     </div>
//   );
// }


import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { CirclePower, Download, FileCheck, Pencil, Trash2, ListCollapse, BookCheck } from "lucide-react";

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
  }
) {
  //loan is "Completed" when approved AND isLoanContinuing is false
  const isCompleted = row.approved_status === 1 && !row.isLoanContinuing;

  return (
    <div className="space-x-2 d-flex align-items-center justify-content-end">
      {/* ── Download Loan Completion Report PDF (only when Completed) ── */}
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

      {/* ── Download Loan Detail Report PDF (always visible) ── */}
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

    </div>
  );
}