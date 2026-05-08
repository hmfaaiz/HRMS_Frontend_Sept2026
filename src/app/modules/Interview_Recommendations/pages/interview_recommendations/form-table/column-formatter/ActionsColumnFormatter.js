import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { ClipboardList, Eye } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  { openRecommendationModal, openViewModal }
) {
  // ── More precise check — object must have actual submitted data ──
  const hasRecommendation = !!(
    row.myRecommendation?.interview_remarks ||
    row.myRecommendation?.interview_recommendation ||
    row.myRecommendation?.recommendedApplicantStatusId
  );

  return (
    <div className="space-x-2">

      {/* Show Add icon ONLY if recommendation not yet submitted */}
      {!hasRecommendation && (
        <OverlayTrigger
          overlay={
            <Tooltip id={`rec-tooltip-${row.Id}`}>
              Add Recommendation
            </Tooltip>
          }
        >
          <span
            className="cursor-pointer"
            onClick={() => openRecommendationModal(row.Id)}
          >
            <ClipboardList className="w-4 h-4 text-black" />
          </span>
        </OverlayTrigger>
      )}

      {/* Show View icon ONLY if recommendation already submitted */}
      {hasRecommendation && (
        <OverlayTrigger
          overlay={
            <Tooltip id={`view-tooltip-${row.Id}`}>
              View Recommendation
            </Tooltip>
          }
        >
          <span
            className="cursor-pointer"
            onClick={() => openViewModal(row.Id)}
          >
            <Eye className="w-4 h-4 text-black" />
          </span>
        </OverlayTrigger>
      )}

    </div>
  );
}