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
  {
    setWorkflowId,
    setCurrentData,
    openReadFormDialog,
    openEditFormDialog,
    viewWorkflow,
  },
) {
  return (
    <>
      <OverlayTrigger
        overlay={<Tooltip id="products-edit-tooltip">View Detail</Tooltip>}
      >
        <a
          title=""
          // className="btn btn-icon edit-button"
          onClick={() => {
            viewWorkflow(row);
          }}
        >
          <Eye className="w-4 h-4" />
        </a>
      </OverlayTrigger>

      {row.authorityStatus === "P" && (
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Process</Tooltip>}
        >
          <a
            onClick={() => {
              openEditFormDialog(row);
            }}
          >
            <Pencil className="w-4 h-4 text-black cursor-pointer" />
          </a>
        </OverlayTrigger>
      )}
    </>
  );
}
