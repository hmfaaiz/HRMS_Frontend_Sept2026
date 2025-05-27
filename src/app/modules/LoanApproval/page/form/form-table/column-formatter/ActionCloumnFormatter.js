import React, { useMemo } from "react";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useFormUIContext } from "../../../FormUIContext";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  { setWorkflowId, setCurrentData }
) {
  return (
    <>
      <OverlayTrigger
        overlay={
          <Tooltip id="products-edit-tooltip">View Workflow Status</Tooltip>
        }
      >
        <a
          title=""
          className="btn btn-icon edit-button"
          onClick={() => {
            setWorkflowId(row?.parentRecordId);
            setCurrentData(row);
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
