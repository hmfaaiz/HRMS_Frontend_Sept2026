import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FileText, Plus } from "lucide-react";

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
  },
) {
  return (
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
              cursor: beforeCreation ? "not-allowed" : "pointer",
              opacity: beforeCreation ? 0.5 : 1,
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
  );
}
