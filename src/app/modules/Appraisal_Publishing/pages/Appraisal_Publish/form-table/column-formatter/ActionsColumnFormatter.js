import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  ArrowUpRight,
  CirclePause,
  CirclePower,
  Eye,
  Trash2,
  Users,
  Download,
  File,
  FileText,
} from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  {
    openPublishFormDialog,
    openHoldFormDialog,
    openDeleteFormDialog,
    openAuthortiesFormDialog,
    openDetailFormDialog,
    isAccessForPublish,
    isAccessForDetail,
    isAccessForHold,
    isAccessForDelete,
    setYearId,
    setAppraisalCategoryId,
    onDownloadReport,
  }
) {
  return (
    <div className="space-x-2">
      <OverlayTrigger
        overlay={<Tooltip id="products-download-tooltip">Download Report</Tooltip>}
      >
        <a
          title=""
          className=""
          onClick={() => {
            if (onDownloadReport) onDownloadReport(row);
          }}
        >
          <FileText className="w-4 h-4 text-black cursor-pointer" />
        </a>
      </OverlayTrigger>
      {isAccessForPublish && row?.isActive && !row?.isPublish && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Publish</Tooltip>}
        >
          <a
            title=""
            className=""
            onClick={() => {
              setYearId(row?.yearId);
              setAppraisalCategoryId(row?.appraisalCategoryId);
              openPublishFormDialog(row.Id);
            }}
          >
            <ArrowUpRight className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}
      {isAccessForDetail && row?.isActive && (
        <OverlayTrigger
          overlay={
            <Tooltip id="products-edit-tooltip">View Authorties</Tooltip>
          }
        >
          <a
            title=""
            className=""
            onClick={() => {
              setYearId(row?.yearId);
              setAppraisalCategoryId(row?.appraisalCategoryId);
              openAuthortiesFormDialog(row.Id);
            }}
          >
            <Users className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}
      {isAccessForDetail && row?.isActive && (
        <OverlayTrigger
          overlay={
            <Tooltip id="products-edit-tooltip">View Questions</Tooltip>
          }
        >
          <a
            title=""
            className=""
            onClick={() => {
              setYearId(row?.yearId);
              setAppraisalCategoryId(row?.appraisalCategoryId);
              openDetailFormDialog(row.Id);
            }}
          >
            <Eye className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}
      {isAccessForHold && row?.isActive && row?.isPublish && (
        <OverlayTrigger
          overlay={
            <Tooltip id="products-edit-tooltip">
              {row?.isHold ? "Resume" : "Hold"}
            </Tooltip>
          }
        >
          <a
            title=""
            className=""
            onClick={() => {
              setYearId(row?.yearId);
              setAppraisalCategoryId(row?.appraisalCategoryId);
              openHoldFormDialog(row.Id, row?.isHold ? 1 : 0);
            }}
          >
            {!row?.isHold ? (
              <CirclePause className="w-4 h-4 text-black cursor-pointer" />
            ) : (
              <CirclePower className="w-4 h-4 text-black cursor-pointer" />
            )}
          </a>
        </OverlayTrigger>
      )}
     
      {isAccessForDelete && row?.isPublish && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Delete</Tooltip>}
        >
          <a
            title=""
            onClick={() => {
              setYearId(row?.yearId);
              setAppraisalCategoryId(row?.appraisalCategoryId);
              openDeleteFormDialog(row.Id);
            }}
          >
            <Trash2 className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}
    </div>
  );
}
