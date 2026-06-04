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
  { setWorkflowId, setCurrentData }
) {
  return (
    <>
    <div className="flex items-center justify-end gap-3 w-full">
      <OverlayTrigger
        overlay={<Tooltip id="products-edit-tooltip">View Detail</Tooltip>}
      >
        <a
          title=""
          // className="btn btn-icon edit-button"
          onClick={() => {
            setWorkflowId(row?.parentRecordId);
            setCurrentData(row);
          }}
        >
          <Eye className="w-4 h-4" />
        </a>
      </OverlayTrigger>
      </div>
    </>
  );
}
