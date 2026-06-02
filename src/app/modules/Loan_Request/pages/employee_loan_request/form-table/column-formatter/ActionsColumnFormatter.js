import React from "react";
import SVG from "react-inlinesvg";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Minus, RotateCcw, Eye } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,

  { setIds, isAccessForReapply, setWorkflowId, setCurrentData }
) {
  return (
    <div className="flex items-center justify-end gap-3 w-full">
      {/* Re-apply button */}
      <div className="flex items-center gap-2">
        {isAccessForReapply &&
        row.isActive &&
        row.request_status === "R" &&
        row?.approved_status == 2 ? (
          <OverlayTrigger
            overlay={<Tooltip id="loan-reapply-tooltip">Re-apply</Tooltip>}
          >
            <a className="cursor-pointer" onClick={() => setIds(row.Id)}>
              <RotateCcw className="w-4 h-4" />
            </a>
          </OverlayTrigger>
        ) : (
          <span className="font-bold">
            <Minus className="w-4 h-4" />
          </span>
        )}
      </div>

      {/* View Workflow button */}
      <div className="flex items-center">
        {row?.request_status === "P" ||
        row?.request_status === "A" ||
        row?.request_status === "R" ? (
          <OverlayTrigger
            overlay={
              <Tooltip id="view-loan-workflow-tooltip">View Workflow</Tooltip>
            }
          >
            <a
              className="cursor-pointer"
              onClick={() => {
                setWorkflowId(row.Id);
                setCurrentData(row);
              }}
            >
              <Eye className="w-4 h-4 text-black" />
            </a>
          </OverlayTrigger>
        ) : (
          <span className="font-bold">
            <Minus className="w-4 h-4" />
          </span>
        )}
      </div>
    </div>
  );
}