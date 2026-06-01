import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  CircleArrowOutUpRight,
  CirclePower,
  Eye,
  IdCardLanyard,
  Pencil,
  ThumbsUp,
  Trash2,
} from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,

  {
    openEditFormDialog,
    openReadFormDialog,
    openConsentDialog,
    isAccessForEdit,
    isAccessForRead,
    openAnalysisFormDialog,
  },
) {
  return (
    <div className="space-x-2">
      {row?.isSubmitted && row?.sendConsent && row?.isSelf ? (
        <OverlayTrigger
          overlay={
            <Tooltip id="products-edit-tooltip">
              Send Consent
            </Tooltip>
          }
        >
          <a
            title=""
            className=""
            onClick={() => {
              if (row?.appraisalReviewId)
                openConsentDialog(row?.appraisalReviewId);
            }}
          >
            <ThumbsUp className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      ) : null}
      <OverlayTrigger
        overlay={
          <Tooltip id="products-edit-tooltip">View Employee Analaytics</Tooltip>
        }
      >
        <a
          title=""
          className=""
          onClick={() => {
            if (row?.FromEmp?.Id)
              openAnalysisFormDialog(row?.FromEmp?.Id, row?.Id);
          }}
        >
          <IdCardLanyard className="w-4 h-4 text-black cursor-pointer" />
        </a>
      </OverlayTrigger>
      {isAccessForRead && row?.isSubmitted && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">View</Tooltip>}
        >
          <a title="" className="" onClick={() => openReadFormDialog(row.Id)}>
            <Eye className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}
      {isAccessForEdit && !row?.isSubmitted && (
        <OverlayTrigger
          overlay={
            <Tooltip id="products-edit-tooltip">Attempt Feedback</Tooltip>
          }
        >
          <a title="" className="" onClick={() => openEditFormDialog(row.Id)}>
            <CircleArrowOutUpRight className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}
    </div>
  );
}
