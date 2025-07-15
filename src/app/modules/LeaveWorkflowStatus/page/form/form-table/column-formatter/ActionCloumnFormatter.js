import React, { useMemo } from "react";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useFormUIContext } from "../../../FormUIContext";

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
          <Tooltip id="products-edit-tooltip">View Leave Balance</Tooltip>
        }
      >
        <a
          title=""
          className="btn btn-icon view-button"
          onClick={() => {
            if (row?.requestBelongToEmpId) {
              setLeaveWorkflowId(null);
              setLeaveBalanceId(row?.requestBelongToEmpId);
              setLeaveData(row);
            }
          }}
        >
          <span className="svg-icon svg-icon-md svg-icon-primary">
            <SVG
              src={toAbsoluteUrl(
                "/media/svg/icons/Communication/leave_balance.svg"
              )}
            />
          </span>
        </a>
      </OverlayTrigger>
      <OverlayTrigger
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
      </OverlayTrigger>
    </>
  );
}
