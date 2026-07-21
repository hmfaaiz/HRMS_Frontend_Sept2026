import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { CirclePower, Eye, Pencil, Trash2 ,FileText} from "lucide-react";

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

    dispatch,
    reportPdfLoading,
    downloademployeeProfileWorkflowPortalReport,
    isAccessForReport,
    latestRequests,
  }
) {

  const isLatestForEmployee = latestRequests && latestRequests[row.employeeId] === row.Id;

  // Hide Edit & Delete once the transfer's from-date has been reached
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const fromDate = row.transferFromDate ? new Date(row.transferFromDate) : null;
  if (fromDate) fromDate.setHours(0, 0, 0, 0);
  const isTransferStarted = fromDate ? today >= fromDate : false;
  return (

    <div className="space-x-2">
       {isAccessForReport && (
       <OverlayTrigger
        overlay={<Tooltip id={`vacancy-report-${row.Id}`}>Download Report</Tooltip>}
      >
        <a
          onClick={() => !reportPdfLoading && dispatch(downloademployeeProfileWorkflowPortalReport(row.Id))}
          style={{
            cursor: reportPdfLoading ? "not-allowed" : "pointer",
            opacity: reportPdfLoading ? 0.5 : 1,
          }}
        >
          <FileText className="w-4 h-4 text-black" />
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
      {isAccessForEdit && !row?.jobPostingStatus && isLatestForEmployee && !isTransferStarted && !row?.isApproved && (
        <OverlayTrigger
          overlay={<Tooltip id={`edit-tooltip-${row.Id}`}>Edit</Tooltip>}
        >
          <a className="" onClick={() => openEditFormDialog(row.Id)}>
            <Pencil className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}

      {/* Delete or Activate */}
      {isAccessForDelete && !row?.jobPostingStatus && isLatestForEmployee && !isTransferStarted && (
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


    </div>
  );
}
