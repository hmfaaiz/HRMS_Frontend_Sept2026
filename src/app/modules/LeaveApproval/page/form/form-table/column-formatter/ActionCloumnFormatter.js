import React, { useMemo } from "react";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useFormUIContext } from "../../../FormUIContext";
import { Eye } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  { setLeaveBalanceId, setLeaveWorkflowId, setLeaveData }
) {
  return (
    <>
      {/* <OverlayTrigger
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
      </OverlayTrigger> */}
      <OverlayTrigger
        overlay={<Tooltip id="products-edit-tooltip">View Detail</Tooltip>}
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
    </>
  );
}
