import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye, GitBranch } from "lucide-react";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  { openReadFormDialog, openWorkflowDialog },
) {
  return (
    <div className="space-x-2 flex justify-end">
      <OverlayTrigger
        overlay={<Tooltip id="products-view-tooltip">View</Tooltip>}
      >
        <a onClick={() => openReadFormDialog(row)} style={{ cursor: "pointer" }}>
          <Eye className="w-4 h-4 text-black cursor-pointer" />
        </a>
      </OverlayTrigger>

      <OverlayTrigger
        overlay={<Tooltip id="workflow-view-tooltip">View Workflow</Tooltip>}
      >
        <a onClick={() => openWorkflowDialog(row)} style={{ cursor: "pointer" }}>
          <GitBranch className="w-4 h-4 text-black cursor-pointer" />
        </a>
      </OverlayTrigger>
    </div>
  );
}