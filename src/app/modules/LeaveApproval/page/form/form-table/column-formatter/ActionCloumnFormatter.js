import React, { useMemo } from "react";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useFormUIContext } from "../../../FormUIContext";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  { setLeaveBalanceId, setLeaveWorkflowId }
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
          className="btn btn-icon read-button"
          onClick={() => {
            if (row?.requestBelongToEmpId) {
              setLeaveWorkflowId(null);
              setLeaveBalanceId(row?.requestBelongToEmpId);
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
          className="btn btn-icon read-button"
          onClick={() => {
            setLeaveBalanceId(null);
            setLeaveWorkflowId(row?.parentRecordId);
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
