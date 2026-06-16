import React, { useMemo } from "react";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useFormUIContext } from "../../../FormUIContext";
import { Eye, Pencil } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  { setWorkflowId, setCurrentData ,setEditableWorkflowId}
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

        { row.isAccessToUpdate && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Edit</Tooltip>}
        >
          <a title="" className="" onClick={() => {
             setCurrentData(row);
             setEditableWorkflowId(row?.parentRecordId);
          
          }}>
            <Pencil className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}

      </div>
    </>
  );
}
