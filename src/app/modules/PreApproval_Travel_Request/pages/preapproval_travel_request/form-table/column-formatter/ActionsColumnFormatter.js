import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye, Pencil, Trash2, FileDown, FileText } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  {
    openReadFormDialog,
    openEditFormDialog,
    openDeleteFormDialog,
    openReportDownload,
  },
) {
  const id = row.id || row.Id;
  return (
    <div className="space-x-2 flex justify-end">
      <OverlayTrigger
        overlay={
          <Tooltip id="products-report-tooltip">Download Report</Tooltip>
        }
      >
        <a onClick={() => openReportDownload(id)}>
          <FileText className="w-4 h-4 text-black" />{" "}
        </a>
      </OverlayTrigger>
      <OverlayTrigger
        overlay={<Tooltip id="products-view-tooltip">View</Tooltip>}
      >
        <a onClick={() => openReadFormDialog(row)}>
          <Eye className="w-4 h-4 text-black cursor-pointer" />
        </a>
      </OverlayTrigger>

      {row.request_status == "A" && row.approved_status === 0 && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Edit</Tooltip>}
        >
          <a onClick={() => openEditFormDialog(row)}>
            <Pencil className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}

      {row.request_status == "A" && row.approved_status === 0 && (
        <OverlayTrigger
          overlay={<Tooltip id="products-delete-tooltip">Delete</Tooltip>}
        >
          <a onClick={() => openDeleteFormDialog(id)}>
            <Trash2 className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}
    </div>
  );
}
