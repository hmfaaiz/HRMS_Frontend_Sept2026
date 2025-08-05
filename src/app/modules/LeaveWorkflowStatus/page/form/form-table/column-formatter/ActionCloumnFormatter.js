import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  { setLeaveBalanceId, setLeaveWorkflowId, setLeaveData }
) {
  return (
    <>
      <OverlayTrigger
        overlay={
          <Tooltip id="products-edit-tooltip">View Detail</Tooltip>
        }
      >
        <a
          title=""
          // className="btn btn-icon edit-button"
          onClick={() => {
            if (row?.requestBelongToEmpId) {
              setLeaveBalanceId(null);
              setLeaveWorkflowId(row?.parentRecordId);
              setLeaveBalanceId(row?.requestBelongToEmpId);
              setLeaveData(row);
            }
          }}
        >
          <Eye className="w-4 h-4" />
        </a>
      </OverlayTrigger>
      {/* <OverlayTrigger
        overlay={
          <Tooltip id="products-edit-tooltip">View Workflow Status</Tooltip>
        }
      >
        <a
          title=""
          className="btn btn-icon edit-button"
          onClick={() => {
            setLeaveBalanceId(null);
            setLeaveWorkflowId(row?.parentRecordId);
            setLeaveData(row);
          }}
        >
          <span className="svg-icon svg-icon-md svg-icon-primary">
            <SVG
              src={toAbsoluteUrl("/media/svg/icons/Communication/worflow.svg")}
            />
          </span>
        </a>
      </OverlayTrigger> */}
    </>
  );
}
